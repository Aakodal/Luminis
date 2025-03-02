const { prefix } = require('../require.js');
const { sendError } = require('../lib/functions.js');

module.exports = {
    name: 'say',
    category: 'fun',
    description: "Fait dire un message ou autre au bot",
    usage: `${prefix}say <texte>`,
    exemple: `${prefix}say Coucou :smile: !`,
    access: 'ADMINISTRATOR',
    execute(message, args){
        if(!args[0]) return sendError("Veuillez préciser un texte à me faire dire.", message);
        
        message.channel.send(args.slice(0).join(" "));
    }
}