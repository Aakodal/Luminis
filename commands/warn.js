const { prefix, client, config, Discord } = require('../require.js');
const { createEmbed } = require('../lib/functions.js');

module.exports = {
    name: 'warn',
    aliases: [ 'avert' ],
    description: "Avertit un membre pour la raison précisée",
    usage: prefix+'warn <membre mentionné> <raison>',
    exemple: prefix+'warn @Neshell#8701 Poisson d\'avril très mauvais',
    access: 'KICK_MEMBERS',
    execute(message, args){
        if(args[2]){
            let user = message.mentions.users.first();
            let reason = args.slice(2).join(" ");
            if(user) {
                if(!user.bot){
                    let member = message.guild.member(user);
                    let bot = message.guild.member(client.user)
                    if(member){
                        if(user !== message.author){
                            if(member.highestRole.comparePositionTo(message.member.highestRole) < 0 && member.highestRole.comparePositionTo(bot.highestRole) < 0){

                                text = user+" a été averti pour la raison suivante :\n\n"+reason;
                                message.channel.send(createEmbed("Modération", 'server', "Avertissement", 'light_green', text, message));

                                if(config.modLogs.warn.active == true){
                                    let embed = new Discord.RichEmbed()
                                        .setAuthor("Avertissement", message.guild.iconURL)
                                        .setColor(0x00FFFF)
                                        .addField("Membre", user, true)
                                        .addField("Modérateur", message.author, true)
                                        .addField("Raison", reason, false)
                                        .setTimestamp(Date.now())

                                    try {
                                        client.channels.get(config.modLogs.warn.channel).send({embed});
                                    } catch(err) {
                                        message.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
                                        console.log("An error happened when trying to log ; " + err);
                                    }
                                }

                                if(config.modLogs.warn.dm == true){
                                    let embed = new Discord.RichEmbed()
                                        .setAuthor("Avertissement", message.guild.iconURL)
                                        .setColor(0x00FFFF)
                                        .addField("Modérateur", message.author, true)
                                        .addField("Raison", reason, false)
                                        .setTimestamp(Date.now())

                                    try {
                                        user.send({embed});
                                    } catch(err) {
                                        message.guild.owner.send("An error happened when trying to DM ; " + err +"\n\nPlease contact bot author.");
                                        console.log("An error happened when trying to DM ; " + err);
                                    }
                                }

                            } else {
                                text = "Vous ne pouvez pas avertir un membre supérieur ou égal à vous ou à moi.";
                                message.channel.send(createEmbed("Erreur", 'server', '', 'dark_red', text, message));
                            }
                        } else {
                            text = "Vous ne pouvez pas vous avertir vous-même.";
                            message.channel.send(createEmbed("Erreur", 'server', '', 'dark_red', text, message));
                        }
                    } else {
                        text = "Ce membre n'existe pas ou n'est pas sur le serveur.";
                        message.channel.send(createEmbed("Erreur", 'server', '', 'dark_red', text, message))
                    }
                } else {
                    text = "Vous ne pouvez pas avertir un bot."
                    message.channel.send(createEmbed("Erreur", 'server', '', 'dark_red', text, message));
                }
            } else {
                text = "Veuillez mentionner le membre à avertir.";
                message.channel.send(createEmbed("Erreur", 'server', '', 'dark_red', text, message));
            }
        } else {
            text = "Mauvais usage de la commande.\n\n!warn <membre mentionné> <raison>";
            message.channel.send(createEmbed("Erreur", 'server', '', 'dark_red', text, message));
        }
    }
}