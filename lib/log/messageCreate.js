const { client, Discord, config, prefix } = require('../../require.js');

client.on('message', message => {
    if(!message.guild || message.author.bot || message.content.startsWith(prefix)) return;

    if(config.logs.messageCreate.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("Message Envoyé", message.member.user.avatarURL)
            .setColor(0xB5E655)
            .addField("Auteur", message.author, true)
            .addField("Salon", message.channel, true)
            .addField("Message", message.content ? message.content.substr(0, 500) : "❌ `{Pièce Jointe}`", false)
            .setTimestamp(message.createdAt)

        try {
            client.channels.get(config.logs.messageCreate.channel).send({embed});
            if(message.attachments.first()) {
                let file = new Discord.Attachment(message.attachments.first().url)
                client.channels.get(config.logs.messageCreate.channel).send(file)
            }
        } catch(err) {
            message.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});