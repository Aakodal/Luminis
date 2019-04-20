const { prefix, token, Discord, client, config, dateFns } = require('./require.js');
const { createEmbed } = require('./lib/functions.js');
const fs = require('fs');
const colors = require('colors');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const logEvents = fs.readdirSync('./lib/log/').filter(file => file.endsWith('.js'));

for (const file of logEvents) {
    const logs = require(`./lib/log/${file}`);
}

client.on('ready', () => {
    if(config.game.active == true){
        if(config.game.type != "PLAYING" || config.game.type != "STREAMING" || config.game.type != "WATCHING" || config.game.type != "LISTENING"){
            client.user.setActivity(config.game.name);
        } else {
            client.user.setActivity(config.game.name, { type: config.game.type });
        }
    }

    let time = dateFns.format(new Date(), 'H:mm:ss');
    console.log('/-------------------'.cyan + " Started at ".cyan + time.green +" -------------------\\".cyan);
    console.log('|                                                           |'.cyan);
    console.log('|           '.cyan + 'Luminis'.magenta + " | Discord bot by ".cyan + "Neshell".red + ".".cyan + "               |".cyan);
    console.log('|              Current game: '.cyan + config.game.name.green + '                 |'.cyan);
    console.log('|                                                           |'.cyan);
    console.log('\\-----------------------------------------------------------/'.cyan);

});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

    message.delete();

    const args = message.content.slice(prefix.length).split(" ");
    const commandName = args[0].toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command){
        let text = "Cette commande n'existe pas.";
        return message.channel.send(createEmbed("Erreur", 'client', '', 'dark_red', text, message))
    }

    if(command.access){

        if(command.access !== "BOTOWNER") {

            if(message.member.hasPermission(command.access) > 0) {
        
                try {
                    command.execute(message, args);
                } catch(err) {
                    let text = "Une erreur est survenue :\n\n" + err;
                    message.channel.send(createEmbed("Erreur", 'client', '', 'dark_red', text, message))
                }

            } else {
                let text = "Vous n'avez pas la permission requise.";
                message.channel.send(createEmbed("Erreur", 'client', '', 'dark_red', text, message))
            }

        } else {

            if(message.author.id === config.botOwner) {
        
                try {
                    command.execute(message, args);
                } catch(err) {
                    let text = "Une erreur est survenue :\n\n" + err;
                    message.channel.send(createEmbed("Erreur", 'client', '', 'dark_red', text, message))
                }

            } else {
                let text = "Vous n'avez pas la permission requise.";
                message.channel.send(createEmbed("Erreur", 'client', '', 'dark_red', text, message))
            }

        }

    } else {
        try {
            command.execute(message, args);
        } catch(err) {
            let text = "Une erreur est survenue :\n\n" + err;
            message.channel.send(createEmbed("Erreur", 'client', '', 'dark_red', text, message))
        }
    }

});

client.login(token);