const { prefix, token, Discord, client,  config } = require('./require.js');
const { createEmbed } = require('./lib/functions.js');
const fs = require('fs');
const colors = require('colors');
const moment = require('moment');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

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

    const cookies = Math.ceil(Math.random() * (50 - 0) + 0);
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

    message.delete();

    const args = message.content.slice(prefix.length).split(" ");
    const command = args[0].toLowerCase();

    if(!client.commands.has(command)){
        let text = "Cette commande n'existe pas.";
        return message.channel.send(createEmbed("Erreur", 'client', '', 'dark_red', text, message))
    }

    try {
        client.commands.get(command).execute(message, args);
    } catch(err) {
        let text = "Une erreur est survenue :\n\n" + err;
        message.channel.send(createEmbed("Erreur", 'client', '', 'dark_red', text))
    }
});

client.login(token);