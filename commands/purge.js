const { createEmbed } = require('../lib/functions.js');
const { purgeLog } = require('../lib/log/messagePurge.js');

module.exports = {
    name: 'purge',
    alias: [ 'bulk' ],
    description: "Supprime autant de messages que désiré.",
    usage: '!purge <int>',
    exemple: '!purge 23',
    access: 'MANAGE_MESSAGES',
    execute(message, args){
        if(args[1] > 0 || args[1] < 101){
            message.channel.bulkDelete(args[1]);
            purgeLog(message.author, message.member.user.avatarURL, message.channel, args[1]);
        } else {
            text = "L'argument est invalide. Veuillez préciser un nombre entier supérieur ou égal à 1 ou inférieur ou égal à 100.";
            createEmbed("Error", 'server', '', 'dark_red', text);
        }
    }
}