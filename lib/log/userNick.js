const { client, Discord, config } = require('../../require.js');

client.on('guildMemberUpdate', (oldMember, newMember) => {

    if(config.logs.userNick.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("Nickmane Changed", newMember.user.avatarURL)
            .setColor(0xFF6600)
            .addField("Membre", newMember.user, false)
            .addField("Ancien pseudonyme", oldMember.displayName, true)
            .addField("Nouveau pseudonyme", newMember.displayName, true)
            .setTimestamp(Date.now())

        try {
            client.channels.get(config.logs.userNick.channel).send({embed});
        } catch(err) {
            newMember.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});