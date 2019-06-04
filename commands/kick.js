const { prefix, client, config, Discord } = require('../require.js');
const { sendEmbed, sendError } = require('../lib/functions.js');

module.exports = {
    name: 'kick',
    description: "Exclue un membre pour la raison précisée",
    usage: `${prefix}kick <membre mentionné> <raison>`,
    exemple: `${prefix}kick @Neshell#8701 A dit "pain au chocolat"`,
    access: 'KICK_MEMBERS',
    async execute(message, args){
        if(!args[1]) return sendError("Mauvais usage de la commande.\n\n!kick <membre mentionné> <raison>", message);

        const user = message.mentions.users.first();
        const reason = args.slice(1).join(" ");

        if(!user) return sendError("Veuillez mentionner le membre à exclure.", message);

        const member = message.guild.member(user);
        const bot = message.guild.member(client.user);

        if(!member) return sendError("Ce membre n'existe pas ou n'est pas sur le serveur.", message);

        if(user === message.author) return sendError("Vous ne pouvez pas vous exclue vous-même.", message);

        if(!member.highestRole.comparePositionTo(message.member.highestRole) < 0 || !member.highestRole.comparePositionTo(bot.highestRole) < 0) return sendError("Vous ne pouvez pas exclure un membre supérieur ou égal à vous ou à moi.", message);

        if(!member.kickable) return sendError("Ce membre n'a pas pu être exclu.", message);

        sendEmbed({author: "Modération", avatar: 'server', title: "Kick", color: 'light_green', text: `${user} a été exclu pour la raison suivante :\n\n${reason}`, message});

        if(config.modLogs.kick.active == true){
            const embed = new Discord.RichEmbed()
                .setAuthor("Kick", message.guild.iconURL)
                .setColor(0x00FFFF)
                .addField("Membre", user, true)
                .addField("Modérateur", message.author, true)
                .addField("Raison", reason, false)
                .setTimestamp(Date.now())

            try {
                client.channels.get(config.modLogs.kick.channel).send({embed});
            } catch(err) {
                message.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
                console.log("An error happened when trying to log ; " + err);
            }
        }

        if(config.modLogs.kick.dm == true){
            const embed = new Discord.RichEmbed()
                .setAuthor("Kick", message.guild.iconURL)
                .setColor(0x00FFFF)
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

        await member.kick(reason);
    }
}