const { client, Discord, config } = require('../../require.js');

client.on('guildMemberUpdate', (oldMember, newMember) => {

    if(config.logs.userUpdate.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("User Updated", newMember.user.avatarURL)
            .setColor(0xFF6600)
            .addField("Membre", newMember.user, false)
            .setTimestamp(Date.now())

        if(oldMember.displayName !== newMember.displayName){
            embed.addField("Ancien pseudonyme", oldMember.displayName, true)
            embed.addField("Nouveau pseudonyme", newMember.displayName, true)
        }

        if(oldMember.roles !== newMember.roles){
            embed.addField("Ancien(s) rôle(s)", oldMember.roles.array().slice(1, oldMember.roles.array().length), false)
            embed.addField("Nouveau(x) rôle(s)", newMember.roles.array().slice(1, newMember.roles.array().length), false)
        }

        try {
            client.channels.get(config.logs.userUpdate.channel).send({embed});
        } catch(err) {
            newMember.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});
