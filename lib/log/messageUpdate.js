const { client, Discord, config } = require('../../require.js');

client.on('messageUpdate', (oldMessage, newMessage) => {
    if(!newMessage.guild || newMessage.author.bot) return;

    if(config.logs.messageUpdate.active == true) {

        const embed = new Discord.RichEmbed()
            .setAuthor("Message Édité", newMessage.member.user.avatarURL)
            .setColor(0xFF6600)
            .addField("Auteur", newMessage.author, true)
            .addField("Salon", newMessage.channel, true)
            .addField("Ancien message", oldMessage, false)
            .addField("Nouveau message", newMessage, false)
            .setTimestamp(Date.now());

        try {
            client.channels.get(config.logs.messageUpdate.channel).send({embed});
        } catch(err) {
            newMessage.guild.owner.send(`An error happened when trying to log ; ${err}\n\nPlease contact bot author.`);
            console.log(`An error happened when trying to log ; ${err}`);
        }
    }
});
