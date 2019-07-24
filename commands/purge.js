const { prefix } = require('../require.js');
const { sendEmbed, sendError } = require('../lib/functions.js');
const { purgeLog } = require('../lib/log/messagePurge.js');

module.exports = {
    name: 'purge',
    category: 'mod',
    alias: [ 'bulk' ],
    description: "Supprime autant de messages que désiré.",
    usage: `${prefix}purge <int>`,
    exemple: `${prefix}purge 23`,
    access: 'MANAGE_MESSAGES',
    async execute(message, args){
        if(isNaN(args[0]) || args[0] <= 0 || args[0] >= 101) return sendError("L'argument est invalide. Veuillez préciser un nombre entier supérieur ou égal à 1 ou inférieur ou égal à 100.", message);

        await message.channel.bulkDelete(args[0]);
        purgeLog(message.author, message.member.user.avatarURL, message.channel, args[0]);
        sendEmbed({author: "Modération", avatar: 'server', color: 'light_green', text: `${args[0]} message${args[0] > 0 ? "s" : ""} ont bien été supprimés.`, message}).then(msg => {
            msg.delete(3000)
        }).catch(err => {
            console.log("An error happened when trying to delete purge confirmation message ; " + err)
        });
    }
}