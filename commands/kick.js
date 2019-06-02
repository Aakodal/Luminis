const { prefix, client, config, Discord } = require('../require.js');
const { sendEmbed, sendError } = require('../lib/functions.js');

module.exports = {
    name: 'kick',
    description: "Exclue un membre pour la raison précisée",
    usage: prefix+'kick <membre mentionné> <raison>',
    exemple: prefix+'kick @Neshell#8701 A dit "pain au chocolat"',
    access: 'KICK_MEMBERS',
    async execute(message, args){
        if(args[2]){
            const user = message.mentions.users.first();
            const reason = args.slice(2).join(" ");
            if(user) {
                const member = message.guild.member(user);
                const bot = message.guild.member(client.user)
                if(member){
                    if(user !== message.author){
                        if(member.highestRole.comparePositionTo(message.member.highestRole) < 0 && member.highestRole.comparePositionTo(bot.highestRole) < 0){

                            if(member.kickable) {

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

                            } else {
                                sendError("Ce membre n'a pas pu être exclu.", message);
                            }

                        } else {
                            sendError("Vous ne pouvez pas exclure un membre supérieur ou égal à vous ou à moi.", message);
                        }
                    } else {
                        sendError("Vous ne pouvez pas vous exclue vous-même.", message);
                    }
                } else {
                    sendError("Ce membre n'existe pas ou n'est pas sur le serveur.", message);
                }
            } else {
                sendError("Veuillez mentionner le membre à exclure.", message);
            }
        } else {
            sendError("Mauvais usage de la commande.\n\n!kick <membre mentionné> <raison>", message);
        }
    }
}