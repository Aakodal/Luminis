const { prefix, token, Discord, client, config, dateFns, fs } = require('./require.js');
const { sendError, output } = require('./lib/functions.js');
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
        if(config.game.type == "PLAYING" || config.game.type == "STREAMING" || config.game.type == "WATCHING" || config.game.type == "LISTENING"){
            client.user.setActivity(config.game.name, { type: `${config.game.type}` });
        } else {
            client.user.setActivity(config.game.name);
        }
    }

    let time = dateFns.format(new Date(), 'H:mm:ss');
    console.log('/-------------------'.cyan + " Started at ".cyan + time.green +" -------------------\\".cyan);
    console.log('|                                                           |'.cyan);
    console.log('|           '.cyan + 'Luminis'.magenta + " | Discord bot by ".cyan + "Neshell".red + ".".cyan + "               |".cyan);
    console.log('|              Current game: '.cyan + config.game.name.green + '                 |'.cyan);
    console.log('|                                                           |'.cyan);
    console.log('\\-----------------------------------------------------------/'.cyan);
    output("Bot démarré à " + time +".");

    if(config.muteRole.active) {
        client.guilds.array().forEach(server => {
            let muterole = server.roles.find(role => role.name === config.muteRole.name);
            if(muterole) {
                output(`Le rôle ${config.muteRole.name} a bien été trouvé.`);
            } else {
                output(`Le rôle ${config.muteRole.name} n'a pas été trouvé. Création du rôle en cours...`);
                // récupération des permissions
                let permissions = config.muteRole.permissions;
                // on ne récupère que les true
                let permstrue = Object.entries(permissions).filter(permission => permission[1]).map(permission => permission[0]);
                // on définit des permissions de base
                let base = [ "CONNECT", "READ_MESSAGE_HISTORY", "VIEW_CHANNEL" ];
                server.createRole({
                    "name": config.muteRole.name,
                    "permissions": [...base, ...permstrue]
                    // On ajoute uniquement les permissions qui sont déclarées true (permstrue)
                }).then(() => {
                    muterole = server.roles.find(role => role.name === config.muteRole.name);
                    output("Rôle créé. Configuration des salons...");
                    server.channels.forEach(channel => {
                        try {
                            channel.overwritePermissions(muterole, permissions);
                            // On ajoute les permissions
                        } catch(err) {
                            output("Une erreur est survenue :\n\n" + err);
                        }
                    });
                    output("Configuration terminée. Rôle prêt à l'emploi.");
                }).catch(err => {
                    output("Une erreur est survenue :\n\n" + err);
                });
                
            }
        });
    }

});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

    message.delete();

    const args = message.content.slice(prefix.length).split(" ");
    const commandName = args[0].toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command){
        return sendError("Cette commande n'existe pas.", message);
    }

    if(command.access){

        if(command.access !== "BOTOWNER") {

            if(message.member.hasPermission(command.access) > 0) {
        
                try {
                    command.execute(message, args);
                } catch(err) {
                    sendError(`Une erreur est survenue :\n\n + ${err}`, message);
                }

            } else {
                sendError("Vous n'avez pas la permission requise.", message);
            }

        } else {

            if(message.author.id === config.botOwner) {
        
                try {
                    command.execute(message, args);
                } catch(err) {
                    sendError(`Une erreur est survenue :\n\n + ${err}`, message);
                }

            } else {
                sendError("Vous n'avez pas la permission requise.", message);
            }

        }

    } else {
        try {
            command.execute(message, args);
        } catch(err) {
            sendError(`Une erreur est survenue :\n\n + ${err}`, message);
        }
    }

});

client.login(token);