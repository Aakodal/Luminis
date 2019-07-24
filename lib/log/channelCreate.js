const { client, Discord, config } = require('../../require.js');

client.on('channelCreate', channel => {

    if(config.logs.channelCreate.active) {

        if(channel.type !== "dm"){

            const embed = new Discord.RichEmbed()
                .setAuthor("Salon Créé", channel.guild.iconURL)
                .setColor(0xB5E655)
                .addField("Salon", channel.type == "text" ? channel : channel.name, true)
                .addField("Type", channel.type, true)
                .setTimestamp(Date.now());

            try {
                client.channels.get(config.logs.channelCreate.channel).send({embed});
            } catch(err) {
                channel.guild.owner.send(`An error happened when trying to log ; ${err}\n\nPlease contact bot author.`);
                console.log(`An error happened when trying to log ; ${err}`);
            }

        }

    }
});
