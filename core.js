const { prefix, token, Discord, client, commands, config } = require('./require.js');
const colors = require('colors');
const moment = require('moment');

client.on('ready', () => {
    if(config.game.active == true){
        if(config.game.type != "PLAYING" || config.game.type != "STREAMING" || config.game.type != "WATCHING" || config.game.type != "LISTENING"){
            client.user.setActivity(config.game.name);
        } else {
            client.user.setActivity(config.game.name, { type: config.game.type });
        }
    }

    let time = moment(this.startTime).format('H:mm:ss');
    console.log('/-------------------'.cyan + " Started at ".cyan + time.green +" -------------------\\".cyan);
    console.log('|                                                           |'.cyan);
    console.log('|           '.cyan + 'Luminis'.magenta + " | Discord bot by ".cyan + "Neshell".red + ".".cyan + "               |".cyan);
    console.log('|              Current game: '.cyan + config.game.name.green + '                 |'.cyan);
    console.log('|                                                           |'.cyan);
    console.log('\\-----------------------------------------------------------/'.cyan);
});

client.login(token);