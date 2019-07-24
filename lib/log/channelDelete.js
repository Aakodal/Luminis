const { client, Discord, config } = require('../../require.js');

client.on('channelDelete', channel => {

    if(config.logs.channelDelete.active) {

        if(channel.type !== "dm"){

            const embed = new Discord.RichEmbed()
                .setAuthor("Salon Supprimé", channel.guild.iconURL)
                .setColor(0xF33030)
                .addField("Salon", channel.name, true)
                .addField("Type", channel.type, true)
                .setTimestamp(Date.now());

            if(channel.topic){
                embed.addField("Sujet", channel.topic, false);
            }

            try {
                client.channels.get(config.logs.channelDelete.channel).send({embed});
            } catch(err) {
                channel.guild.owner.send(`An error happened when trying to log ; ${err}\n\nPlease contact bot author.`);
                console.log(`An error happened when trying to log ; ${err}`);
            }

        }

    }
});
