const { client, Discord, config } = require('../../require.js');

client.on('emojiUpdate', (old, emoji) => {

    if(config.logs.emojiUpdate.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("Emoji Modifié", emoji.guild.iconURL)
            .setColor(0xFF6600)
            .addField("Emoji", emoji, true)
            .addField("Animé", emoji.animated ? "Oui" : "Non", true)
            .setTimestamp(Date.now())

        if(old.name !== emoji.name){
            embed.addField("Ancien Nom", old.name, true)
            embed.addField("Nouveau Nom", emoji.name, true)
        }

        try {
            client.channels.get(config.logs.emojiUpdate.channel).send({embed});
        } catch(err) {
            emoji.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});
