const { prefix, client, infos } = require('../require.js');

module.exports = {
    name: 'info',
    description: "Affiche les informations du bot",
    usage: `${prefix}info`,
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
					"value": infos.author,
					"inline": true
				},
				{
					"name": "Version",
					"value": infos.version,
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
					"value": "__" + infos.author + " :__ auteur/développeur"
				},
			],
			"footer": {
				"icon_url": message.author.avatarURL,
				"text": "© Luminis - " + infos.author + " | Tous droits réservés. Demandé par "+ message.author.tag
			}
		}

		message.channel.send({embed});
    }
}