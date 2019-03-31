const { prefix, client } = require('../require.js');

module.exports = {
    name: 'info',
    description: "Affiche les informations du bot",
    usage: '!info',
    execute(message, args){
        const embed = {
			"color": 0xB5E655,
			"author": {
				"name": "Luminis - Informations",
				"icon_url": client.user.avatarURL
			},
			"fields": [
				{
					"name": "Auteur",
					"value": "Neshell",
					"inline": true
				},
				{
					"name": "Version",
					"value": '1.0.0',
					"inline": true
				},
				{
					"name": "Librairie",
					"value": "Node.JS - [discord.js](https://discord.js.org/#/)",
					"inline": true
                },
                {
                    "name": "Ping actuel",
                    "value": `\`${client.ping}\` ms`,
                    "inline": true
                },
                {
                    "name": "Cookies",
                    "value": `${Math.ceil(Math.random() * 50)} :cookie:`,
                    "inline": true
                },
                {
                    "name": "Préfixe",
                    "value": prefix,
                    "inline": true
                },
				{
					"name": "Équipe",
					"value": "__Neshell :__ auteur/développeur"
				},
			],
			"footer": {
				"icon_url": "https://media.discordapp.net/icons/287900963472146433/8ad507e94281b055a5d5a154a3de5fc3.jpg",
				"text": "© Luminis - Neshell | Tous droits réservés"
			}
		}

		message.channel.send({embed});
    }
}