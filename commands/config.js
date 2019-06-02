const { prefix, config, client, fs } = require('../require.js');
const { sendEmbed, sendError } = require('../lib/functions.js');

module.exports = {
    name: 'config',
    description: "Effectue une vérification sur la configuration",
    usage: prefix+'config help',
    exemple: prefix+'config joinmessage Bienvenue à ${user} !',
    access: 'ADMINISTRATOR',
    execute(message, args){
        if(args[2]) {
            if(args[1].toLowerCase() === "help") {
                const text = `- verif <type> : vérifie et reconfigure une configuration.\n
                    → mutechannels : reconfigure les permissions du rôle mute dans les salons.`;
                sendEmbed({author: "Configuration", avatar: 'server', title: "Types", color: 'gold', text, message});

            } else if(args[1].toLowerCase() === "verif") {

                if(args[2].toLowerCase() === "mutechannels") {
                    client.guilds.array().forEach(server => {
                        let muterole = message.guild.roles.find(role => role.name === config.muteRole.name);
                        if(!muterole) {
                            return sendError("Le rôle mute n'existe pas. Veuillez redémarrer le bot.", message);
                        }
                        let permissions = config.muteRole.permissions;
                        server.channels.forEach(channel => {
                            try {
                                channel.overwritePermissions(muterole, permissions);
                            } catch(err) {
                                sendError(`Une erreur est survenue :\n\n + ${err}`, message);
                            }
                        });
                        sendEmbed({author: "Configuration", avatar: 'server', color: 'light_green', text: "Reconfiguration terminée.", message});
                    });

                } else {
                    sendError("Cette configuration n'existe pas.", message);
                }

            } else {
                sendError("Argument invalide.", message);
            }
        } else {
            sendError("Veuillez préciser un type de configuration, ou indiquer \"help\" à la suite de la commande.", message);
        }
    }
}