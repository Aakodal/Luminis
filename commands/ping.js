const { client, prefix } = require('../require.js');

module.exports = {
    name: 'ping',
    description: "Vérifier si le bot est en ligne.",
    usage: prefix+'ping',
    access: 'ADMINISTRATOR',
    execute(message, args){
        message.channel.send("Pong. `"+ client.ping +"ms`");
    }
}