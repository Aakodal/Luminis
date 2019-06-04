const { prefix, client, config, Discord } = require('../require.js');
const { sendEmbed, sendError } = require('../lib/functions.js');

module.exports = {
    name: 'warn',
    aliases: [ 'avert' ],
    description: "Avertit un membre pour la raison précisée",
    usage: `${prefix}warn <membre mentionné> <raison>`,
    exemple: `${prefix}warn @Neshell#8701 Poisson d\'avril très mauvais`,
    access: 'KICK_MEMBERS',
    execute(message, args){
        if(!args[1]) return sendError(`Mauvais usage de la commande.\n\n${prefix} warn <membre mentionné> <raison>`, message);

        const user = message.mentions.users.first();
        const reason = args.slice(1).join(" ");

        if(!user) return sendError("Veuillez mentionner le membre à avertir.", message);

        if(user.bot) return sendError("Vous ne pouvez pas avertir un bot.", message);

        const member = message.guild.member(user);
        const bot = message.guild.member(client.user)

        if(member) return sendError("Ce membre n'existe pas ou n'est pas sur le serveur.", message);

        if(user == message.author) return sendError("Vous ne pouvez pas vous avertir vous-même.", message);

        if(member.highestRole.comparePositionTo(message.member.highestRole) < 0 && member.highestRole.comparePositionTo(bot.highestRole) < 0){

            sendEmbed({author: "Modération", avatar: 'server', title: "Avertissement", color: 'light_green', text: `${user} a été averti pour la raison suivante :\n\n${reason}`, message});

            if(config.modLogs.warn.active == true){
                const embed = new Discord.RichEmbed()
                    .setAuthor("Avertissement", message.guild.iconURL)
                    .setColor(0x00FFFF)
                    .addField("Membre", user, true)
                    .addField("Modérateur", message.author, true)
                    .addField("Raison", reason, false)
                    .setTimestamp(Date.now())

                try {
                    client.channels.get(config.modLogs.warn.channel).send({embed});
                } catch(err) {
                    message.guild.owner.send(`An error happened when trying to log ; ${err}\n\nPlease contact bot author.`);
                    console.log(`An error happened when trying to log ; ${err}`);
                }
            }

            if(config.modLogs.warn.dm == true){
                const embed = new Discord.RichEmbed()
                    .setAuthor("Avertissement", message.guild.iconURL)
                    .setColor(0x00FFFF)
                    .addField("Modérateur", message.author, true)
                    .addField("Raison", reason, false)
                    .setTimestamp(Date.now())

                try {
                    user.send({embed});
                } catch(err) {
                    message.guild.owner.send(`An error happened when trying to DM ; ${err}\n\nPlease contact bot author.`);
                    console.log(`An error happened when trying to DM ; ${err}`);
                }
            }

        } else {
            sendError("Vous ne pouvez pas avertir un membre supérieur ou égal à vous ou à moi.", message);
        }
    }
}