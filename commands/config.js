const { prefix, config, client } = require('../require.js');
const { sendEmbed, sendError } = require('../lib/functions.js');

module.exports = {
    name: 'config',
    description: "Effectue une vérification sur la configuration",
    usage: `${prefix}config help`,
    exemple: `${prefix}config joinmessage Bienvenue à \${user} !`,
    access: 'ADMINISTRATOR',
    execute(message, args){
        if(!args[1]) sendError("Veuillez préciser un type de configuration, ou indiquer \"help\" à la suite de la commande.", message);

        if(args[0].toLowerCase() === "help") {
            const text = `- verif <type> : vérifie et reconfigure une configuration.\n
                → mutechannels : reconfigure les permissions du rôle mute dans les salons.`;
            return sendEmbed({author: "Configuration", avatar: 'server', title: "Types", color: 'gold', text, message});

        } else if(args[0].toLowerCase() === "verif") {
            if(args[1].toLowerCase() === "mutechannels") {
                client.guilds.forEach(server => {
                    const muterole = message.guild.roles.find(role => role.name === config.muteRole.name);

                    if(!muterole) return sendError("Le rôle mute n'existe pas. Veuillez redémarrer le bot.", message);

                    const permissions = config.muteRole.permissions;
                    server.channels.forEach(channel => {
                        channel.overwritePermissions(muterole, permissions)
                            .catch(() => sendError(`Une erreur est survenue :\n\n + ${err}`, message));
                    });
                    sendEmbed({author: "Configuration", avatar: 'server', color: 'light_green', text: "Reconfiguration terminée.", message});
                });

            } else {
                sendError("Cette configuration n'existe pas.", message);
            }

        } else {
            sendError("Argument invalide.", message);
        }
    }
}