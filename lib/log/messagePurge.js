const { client, Discord, config } = require('../../require.js');

module.exports.purgeLog = function(author, avatar, channel, size){
    if(config.logs.messagePurge.active) {

        const embed = new Discord.RichEmbed()
            .setAuthor("Purge Effectuée", avatar)
            .setColor(0x9D2DFF)
            .addField("Auteur", author, true)
            .addField("Salon", channel, true)
            .addField("Nombre de messages supprimés", size, false)
            .setTimestamp(Date.now());

        try {
            client.channels.get(config.logs.messagePurge.channel).send({embed});
        } catch(err) {
            message.guild.owner.send(`An error happened when trying to log ; ${err}\n\nPlease contact bot author.`);
            console.log(`An error happened when trying to log ; ${err}`);
        }
    }
}
