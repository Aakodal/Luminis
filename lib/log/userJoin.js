const { client, Discord, config } = require('../../require.js');

client.on('guildMemberAdd', member => {
    if(member.user.bot) return;

    if(config.logs.userJoin.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("User Join", member.user.avatarURL)
            .setColor(0xB5E655)
            .addField("Membre", member.user, true)
            .setTimestamp(Date.now())

        try {
            client.channels.get(config.logs.userJoin.channel).send({embed});
        } catch(err) {
            newMember.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});