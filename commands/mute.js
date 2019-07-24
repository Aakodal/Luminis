const { prefix, client, db, Discord, config } = require('../require.js');
const { sendEmbed, sendError, COLORS } = require('../lib/functions.js');

module.exports = {
    name: 'mute',
    category: 'mod',
    description: "Rend muet un utilisateur de façon permanente",
    usage: `${prefix}mute <membre mentionné> <raison>`,
    exemple: `${prefix}mute @Neshell#8701 Ceci est une raison`,
    access: 'MUTE_MEMBERS',
    async execute(message, args){
        if(!args[1]) return sendError(`Mauvais usage de la commande.\n\n${prefix}mute <membre mentionné> <raison>`, message);

        const user = message.mentions.users.first();
        const reason = args.slice(1).join(" ");

        if(!user) return sendError("Veuillez mentionner le membre à mute.", message);

        const member = message.guild.member(user);
        const bot = message.guild.member(client.user);

        if(!member) return sendError("Ce membre n'existe pas ou n'est pas sur le serveur.", message);

        if(user === message.author) return sendError("Vous ne pouvez pas vous mute vous-même.", message);

        if(member.highestRole.comparePositionTo(message.member.highestRole) >= 0 || member.highestRole.comparePositionTo(bot.highestRole) >= 0) return sendError("Vous ne pouvez pas mute un membre supérieur ou égal à vous ou à moi.", message);

        const muterole = message.guild.roles.find(role => role.name === config.muteRole.name);

        if(member.roles.get(muterole.id)) return sendError("Ce membre est déjà mute.", message);

        sendEmbed({author: "Modération", avatar: 'server', title: "Mute", color: 'light_green', text: `${user} a été mute pour la raison suivante :\n\n${reason}`, message});

        if(config.modLogs.mute.active == true){
            const embed = new Discord.RichEmbed()
                .setAuthor("Mute", message.guild.iconURL)
                .setColor(COLORS['cyan'])
                .addField("Membre", user, true)
                .addField("Modérateur", message.author, true)
                .addField("Raison", reason, false)
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
                .setAuthor("Mute", message.guild.iconURL)
                .setColor(COLORS['cyan'])
                .addField("Modérateur", message.author, true)
                .addField("Raison", reason, false)
                .setTimestamp(Date.now())

            try {
                await user.send({embed});
            } catch(err) {
                message.guild.owner.send("An error happened when trying to DM ; " + err +"\n\nPlease contact bot author.");
                console.log("An error happened when trying to DM ; " + err);
            }
        }

        try {
            await db.insert({discord_id: user.id,
                pseudo: user.tag.replace(' ', ''),
                infraction: reason,
                type: "mute",
                created: Date.now(),
                duration: "PERMANENT",
                moderator: message.author.tag
            }, 'id').into("infractions");

            await db.from("users").where({discord_id: user.id}).then(async data => {
                if(!data[0]) await db.insert({discord_id: user.id}).into("users");
            });

            await db.update({pseudo: user.tag.replace(' ', ''),
                actual_sanction: "muted",
                created: Date.now(),
                reason: reason
            }, 'id').into("users").where({discord_id: user.id});
            
            await member.addRole(muterole);
        } catch(err) {
            message.guild.owner.send("An error happened when trying to mute ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to mute ; " + err);
        }
    }
}