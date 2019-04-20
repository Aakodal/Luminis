const { client, Discord, config } = require('../../require.js');

client.on('emojiCreate', emoji => {

    if(config.logs.emojiCreate.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("Emoji Créé", emoji.guild.iconURL)
            .setColor(0xB5E655)
            .addField("Emoji", emoji, true)
            .addField("Nom", emoji.name, true)
            .addField("Animé", emoji.animated ? "Oui" : "Non", true)
            .setTimestamp(Date.now())

        try {
            client.channels.get(config.logs.emojiCreate.channel).send({embed});
        } catch(err) {
            emoji.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});
