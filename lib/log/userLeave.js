const { client, Discord, config } = require('../../require.js');

client.on('guildMemberRemove', member => {
    if(member.user.bot) return;

    if(config.logs.userLeave.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("User Leave", member.user.avatarURL)
            .setColor(0xF33030)
            .addField("Membre", member.user, true)
            .setTimestamp(Date.now())

        try {
            client.channels.get(config.logs.userLeave.channel).send({embed});
        } catch(err) {
            newMember.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});