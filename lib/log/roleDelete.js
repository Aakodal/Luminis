const { client, Discord, config } = require('../../require.js');

client.on('roleDelete', role => {

    if(config.logs.roleDelete.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("Rôle Supprimé", role.guild.iconURL)
            .setColor(role.hexColor)
            .addField("Rôle", role.name, true)
            .addField("ID", role.id, true)
            .setTimestamp(Date.now())

        try {
            client.channels.get(config.logs.roleDelete.channel).send({embed});
        } catch(err) {
            role.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});