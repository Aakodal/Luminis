const { client, Discord, config } = require('../../require.js');

client.on('emojiDelete', emoji => {

    if(config.logs.emojiDelete.active == true) {

        const embed = new Discord.RichEmbed()
            .setAuthor("Emoji Supprimé", emoji.guild.iconURL)
            .setColor(0xF33030)
            .addField("Emoji", emoji, true)
            .addField("Nom", emoji.name, true)
            .addField("Animé", emoji.animated ? "Oui" : "Non", true)
            .setTimestamp(Date.now());

        try {
            client.channels.get(config.logs.emojiDelete.channel).send({embed});
        } catch(err) {
            emoji.guild.owner.send(`An error happened when trying to log ; ${err}\n\nPlease contact bot author.`);
            console.log(`An error happened when trying to log ; ${err}`);
        }

    }
});
