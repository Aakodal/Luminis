const { client, Discord, config } = require('../../require.js');

client.on('channelUpdate', (old, channel) => {

    if(config.logs.channelUpdate.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("Salon Modifié", channel.guild.iconURL)
            .setColor(0xFF6600)
            .addField("Salon", channel.type == "text" ? channel : channel.name, true)
            .addField("Type", channel.type, true)
            .setTimestamp(Date.now())

        if(old.name !== channel.name) {
            embed.addField("Ancien nom", old.name, false)
        }

        if(old.topic !== channel.topic){
            embed.addField("Ancien sujet", old.topic, false)
            embed.addField("Nouveau sujet", channel.topic, true)
        }

        try {
            client.channels.get(config.logs.channelUpdate.channel).send({embed});
        } catch(err) {
            channel.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});