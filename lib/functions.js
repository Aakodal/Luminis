const { client, Discord, config } = require('../require.js');

const COLORS = {
    'red': 0xFF0000,
    'green': 0x00FF00,
    'blue': 0x0000FF,
    'orange': 0xFF6600,
    'yellow': 0xFFFF00,
    'gold': 0xFFCC00,
    'light_red': 0xF33030,
	'dark_red': 0xA61111,
	'light_green': 0xB5E655,
	'dark_green': 0x00B200,
	'cyan': 0x00FFFF,
	'dark_blue': 0x00008B,
	'brown': 0x8B4513,
	'purple': 0x9d2dff,
	'pink': 0xff6df2,
	'magenta': 0xE500E5
}

function sendEmbed ({author, avatar, title, color, text, footer, message}) {
	color = COLORS[color];

    let avatarembed;
	if(avatar === "client"){
		avatarembed = client.user.avatarURL;
	} else if(avatar === "server" || avatar === "serveur"){
		avatarembed = message.guild.iconURL;
	} else {
		avatarembed = avatar;
	}

	const embed = new Discord.RichEmbed()
		.setAuthor(author ? author : "", avatarembed)
		.setTitle(title ? title : "")
		.setColor(color ? color : '')
		.setDescription(text ? text.replace('%n', '\n') : "")
		.setFooter(footer ? footer : "");
		
	if(message) message.channel.send(embed);
	else return embed;
}

function sendError (text, message) {
    const embed = new Discord.RichEmbed()
		.setAuthor("Erreur", client.user.avatarURL)
		.setColor(COLORS['dark_red'])
        .setDescription(text);

    message.channel.send(embed);
}

async function output (text) {
    await console.log(text);
    if(config.botOutputs.active) {
        await client.channels.get(config.botOutputs.channel).send(text);
    }
}

function randInt (min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

const functions = {
	COLORS,
	sendEmbed,
	sendError,
	output,
	randInt
}

module.exports = functions;