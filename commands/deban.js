const { prefix, client, db, Discord, config } = require('../require.js');
const { sendEmbed, sendError, COLORS } = require('../lib/functions.js');

module.exports = {
    name: 'deban',
    aliases: [ 'unban' ],
    category: 'mod',
    description: "Débannit un membre",
    usage: `${prefix}deban <ID du membre|tag du membre>`,
    exemple: `${prefix}deban Neshell#8701`,
    access: 'BAN_MEMBERS',
    async execute(message, args){
        if(!args[0]) return sendError("Veuillez indiquer l'ID ou le tag du membre à débannir.", message);

        let user = args[0];
        if(isNaN(user)) {
            const tag = args[0].split('#');
            if(!tag[1] ||
                tag[2] ||
                tag[0] === '' ||
                tag[1] === '' ||
                tag[1].length !== 4) return sendError("Le tag du membre est invalide. Veuillez suivre le modèle `pseudo#1234`. Notez que le tag stocké dans la base de données est exactement celui que le membre possédait lorsque celui-ci a été banni.", message);
        }

        if(isNaN(user)) {
            await db.from("users").where({pseudo: user}).then(async data => {
                if(!data[0]) return sendError("Le tag du membre spécifié n'est pas dans la base de données.", message);
                else user = data[0];
            });
        } else {
            await db.from("users").where({discord_id: user}).then(async data => {
                if(!data[0]) return sendError("L'ID du membre spécifié n'est pas dans la base de données.", message);
                else user = data[0];
            });
        }

        if(user.discord_id === message.author.id) return sendError("Quelle idée de vouloir se débannir soi-même alors qu'on n'est même pas banni ?", message);

        if(user.actual_sanction !== "banned") return sendError("Ce membre n'est pas banni.", message);

        sendEmbed({author: "Modération", avatar: 'server', title: "Deban", color: 'light_green', text: `<@${user.discord_id}> a été débanni.`, message});

        if(config.modLogs.ban.active == true){
            const embed = new Discord.RichEmbed()
                .setAuthor("Deban", message.guild.iconURL)
                .setColor(COLORS['gold'])
                .addField("Membre", `<@${user.discord_id}>`, true)
                .addField("Modérateur", message.author, true)
                .setTimestamp(Date.now())

            try {
                client.channels.get(config.modLogs.ban.channel).send({embed});
            } catch(err) {
                message.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
                console.log("An error happened when trying to log ; " + err);
            }
        }

        try {
            await client.fetchUser(id).then(async info => {
                await db.update({pseudo: info.tag, actual_sanction: null, created: null, expiration: null, reason: null}, 'id').into("users").where({discord_id: user.discord_id});
            });
            const bans = await message.guild.fetchBans().then(bans => bans).catch(() => { return; });
            if(bans.get(user.discord_id)) await message.guild.unban(user.discord_id);
        } catch(err) {
            message.guild.owner.send("An error happened when trying to demute ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to demute ; " + err);
        }
    }
}