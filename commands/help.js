const { prefix, Discord, client } = require('../require.js');
const { createEmbed } = require('../lib/functions.js');

module.exports = {
    name: 'help',
    description: "Affiche toutes les commandes, leur description ainsi que leur usage",
    usage: '!help [command]',
    exemple: '!help || !help info',
    execute(message, args){
        const embed = new Discord.RichEmbed().setColor(0xB5E655);
        if(args[1]) {
            if(client.commands.get(args[1]).name){
                if(client.commands.get(args[1]).access != null) {
                    if(message.member.hasPermission(client.commands.get(args[1]).access)) {
                        embed.setTitle(`${prefix}${args[1]} - Informations`);
                        ['description', 'aliases', 'usage', 'exemple', 'access'].forEach(property => {
                            if(client.commands.get(args[1])[property] != null){
                                embed.addField(property, client.commands.get(args[1])[property]);
                            }
                        });
                    }
                } else {
                    embed.setTitle(`${prefix}${args[1]} - Informations`);
                    ['description', 'aliases', 'usage', 'exemple', 'access'].forEach(property => {
                        if(client.commands.get(args[1])[property] != null){
                            embed.addField(property, client.commands.get(args[1])[property]);
                       }
                    });
                }
                message.channel.send(embed);
            } else {
                let text = "Cette commande n'existe pas.";
                message.channel.send(createEmbed("Erreur", 'client', '', 'dark_red', text, message));
            }
        } else {
            embed.setTitle("Commandes disponibles :");
            client.commands.forEach(command => {
                if(command.access != null) {
                    if(message.member.hasPermission(command.access)) {
                        embed.addField(prefix+command.name, command.description);
                    }
                } else {
                    embed.addField(prefix+command.name, command.description);
                }
            });
            message.channel.send(embed);
        }
    }
}