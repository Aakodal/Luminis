const { client, Discord, config, prefix } = require('../../require.js');

client.on('messageDelete', message => {
    if(!message.guild || message.author.bot || message.content.startsWith(prefix)) return;

    if(config.logs.messageDelete.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("Message Supprimé", message.member.user.avatarURL)
            .setColor(0xF33030)
            .addField("Auteur", message.author, true)
            .addField("Salon", message.channel, true)
            .addField("Message", message.content ? message.content.substr(0, 500) : "❌ `{Pièce Jointe}`", false)
            .setTimestamp(message.createdAt)

        try {
            client.channels.get(config.logs.messageDelete.channel).send({embed});
        } catch(err) {
            message.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }
    }
});
