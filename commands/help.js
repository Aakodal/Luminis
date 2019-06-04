const { prefix, Discord, client, isNumber, config } = require('../require.js');
const { sendError } = require('../lib/functions.js');

module.exports = {
    name: 'help',
    description: "Affiche toutes les commandes, leur description ainsi que leur usage",
    usage: `${prefix}help [command]`,
    exemple: `${prefix}help || !help info`,
    execute(message, args){
        let embed = new Discord.RichEmbed().setColor(0xB5E655);
        let stockEmbeds = [];
        const updateReactions = (message, page) => {
            if(stockEmbeds.length > 1){
                if (page === 0) {
                    [...'➡⏭'].forEach((emoji, index) => {
                        setTimeout(() => {
                            message.react(emoji)
                        }, index * 1000)
                    });
                } else if (page === stockEmbeds.length - 1) {
                    [...'⏮⬅'].forEach((emoji, index) => {
                        setTimeout(() => {
                            message.react(emoji)
                        }, index * 1000)
                    });
                } else {
                    [...'⏮⬅➡⏭'].forEach((emoji, index) => {
                        setTimeout(() => {
                            message.react(emoji)
                        }, index * 1000)
                    });
                }
            }
        }
        
        if(args[0] && isNaN(args[0])) {
            if(!client.commands.get(args[0])) return sendError("Cette commande n'existe pas.", message);

            if(client.commands.get(args[0]).access) {
                if(client.commands.get(args[0]).access !== "BOTOWNER") {
                    if(!message.member.hasPermission(client.commands.get(args[0]).access)) return sendError("Vous n'avez pas la permission requise.", message);

                    embed.setTitle(`${prefix}${args[0]} - Informations`);
                    ['description', 'aliases', 'usage', 'exemple', 'access'].forEach(property => {
                        if(client.commands.get(args[0])[property]){
                            embed.addField(property.charAt(0).toUpperCase() + property.slice(1), client.commands.get(args[0])[property]);
                        }
                    });

                } else {
                    if(message.author.id !== config.botOwner) return sendError("Vous n'avez pas la permission requise.", message);

                    embed.setTitle(`${prefix}${args[0]} - Informations`);
                    ['description', 'aliases', 'usage', 'exemple', 'access'].forEach(property => {
                        if(client.commands.get(args[0])[property]){
                            embed.addField(property.charAt(0).toUpperCase() + property.slice(1), client.commands.get(args[0])[property]);
                        }
                    });

                }
            } else {
                embed.setTitle(`${prefix}${args[0]} - Informations`);
                ['description', 'aliases', 'usage', 'exemple', 'access'].forEach(property => {
                    if(client.commands.get(args[0])[property]){
                        embed.addField(property.charAt(0).toUpperCase() + property.slice(1), client.commands.get(args[0])[property]);
                    }
                });
            }
            if(embed.fields.values().next().value) {
                embed.setFooter("Demandé par " + message.author.tag, message.author.avatarURL);
                message.channel.send(embed);
            }
        } else {
            [...client.commands.values()]
                .forEach((command, index) => {
                    if(command.access) {
                        if(command.access !== "BOTOWNER") {
                            if(message.member.hasPermission(command.access)) {
                                embed.addField(prefix+command.name, command.description);
                            }
                        } else {
                            if(message.author.id === config.botOwner) {
                                embed.addField(prefix+command.name, command.description);
                            }
                        }
                    } else {
                        embed.addField(prefix+command.name, command.description);
                    }
                    
                    if((index + 1) % 5 === 0){
                        stockEmbeds.push(embed);
                        embed = new Discord.RichEmbed().setColor(0xB5E655);
                    }
                });

            if(embed.fields.values().next().value) stockEmbeds.push(embed);

            stockEmbeds.forEach((page, index) => {
                page.setTitle(`Commandes disponibles - Page ${index + 1} sur ${stockEmbeds.length}`);
                page.setFooter("Demandé par " + message.author.tag, message.author.avatarURL);
            });
        
            let currentPage = args[0] && isNumber(args[0]) && stockEmbeds[+args[0] - 1] ? +args[0] - 1 : 0;
            let author = message.author;
            
            message.channel.send(stockEmbeds[currentPage]).then(embedMessage => {
                updateReactions(embedMessage, currentPage);

                client.on("messageReactionAdd", (reaction, user) => {
                    if(reaction.message.id !== embedMessage.id || user !== author || user.bot || '⏮⬅➡⏭'.indexOf(reaction.emoji.name) < 0) return;
                    
                    switch (reaction.emoji.name) {
                        case '⏮':
                            currentPage = 0
                            break
                        case '⬅':
                            currentPage--
                            break
                        case '➡':
                            currentPage++
                            break
                        case '⏭':
                            currentPage = stockEmbeds.length - 1
                            break
                        default:
                            currentPage = 0
                    }

                    embedMessage.clearReactions().then(() => {
                        embedMessage.edit(stockEmbeds[currentPage]);
                        updateReactions(embedMessage, currentPage);
                    });
                });
            }).catch(err => {
                sendError(`Une erreur est survenue :\n\n${err}`, message);
            });
        }
    }
}