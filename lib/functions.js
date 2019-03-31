const { client, Discord } = require('../require.js');

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

module.exports.createEmbed = function(author, avatar, title, color, text, message) {
	color = COLORS[color];

	if(avatar === "client"){
		var avatarembed = client.user.avatarURL;
	} else if(avatar === "server" || avatar === "serveur"){
		var avatarembed = message.guild.iconURL;
	} else {
		var avatarembed = avatar;
	}

	const embed = new Discord.RichEmbed()
		.setAuthor(author, avatarembed)
		.setTitle(title)
		.setColor(color)
		.setDescription(text.replace('%n', '\n'));
		
	return embed;
}