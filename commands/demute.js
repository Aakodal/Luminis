const { prefix, client, db, Discord, config } = require('../require.js');
const { sendEmbed, sendError, COLORS } = require('../lib/functions.js');

module.exports = {
    name: 'demute',
    aliases: [ 'unmute' ],
    category: 'mod',
    description: "Démute un membre",
    usage: `${prefix}demute <membre mentionné>`,
    exemple: `${prefix}demute @Neshell#8701`,
    access: 'MUTE_MEMBERS',
    async execute(message, args){
        const user = message.mentions.users.first();

        if(!user) return sendError("Veuillez mentionner le membre à démute.", message);

        const member = message.guild.member(user);
        const bot = message.guild.member(client.user);

        if(!member) return sendError("Ce membre n'existe pas ou n'est pas sur le serveur.", message);

        if(user === message.author) return sendError("Quelle idée de vouloir se démute soi-même alors qu'on n'est même pas muet ?", message);

        if(member.highestRole.comparePositionTo(message.member.highestRole) >= 0 || member.highestRole.comparePositionTo(bot.highestRole) >= 0) return sendError("Vous ne pouvez pas démute un membre supérieur ou égal à vous ou à moi.", message);

        const muterole = message.guild.roles.find(role => role.name === config.muteRole.name);

        if(!member.roles.get(muterole.id)) return sendError("Ce membre n'est pas muet.", message);

        sendEmbed({author: "Modération", avatar: 'server', title: "Demute", color: 'light_green', text: `${user} a été démute.`, message});

        if(config.modLogs.mute.active == true){
            const embed = new Discord.RichEmbed()
                .setAuthor("Demute", message.guild.iconURL)
                .setColor(COLORS['gold'])
                .addField("Membre", user, true)
                .addField("Modérateur", message.author, true)
                .setTimestamp(Date.now())

            try {
                client.channels.get(config.modLogs.mute.channel).send({embed});
            } catch(err) {
                message.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
                console.log("An error happened when trying to log ; " + err);
            }
        }

        if(config.modLogs.mute.dm == true){
            const embed = new Discord.RichEmbed()
                .setAuthor("Demute", message.guild.iconURL)
                .setColor(COLORS['gold'])
                .addField("Modérateur", message.author, true)
                .setTimestamp(Date.now())

            try {
                await user.send({embed});
            } catch(err) {
                message.guild.owner.send("An error happened when trying to DM ; " + err +"\n\nPlease contact bot author.");
                console.log("An error happened when trying to DM ; " + err);
            }
        }

        try {
            await db.from("users").where({discord_id: user.id}).then(async data => {
                if(data[0]) await db.update({pseudo: user.username, actual_sanction: null, created: null, expiration: null, reason: null}, 'id').into("users").where({discord_id: user.id});
            });
            await member.removeRole(muterole);
        } catch(err) {
            message.guild.owner.send("An error happened when trying to demute ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to demute ; " + err);
        }
    }
}