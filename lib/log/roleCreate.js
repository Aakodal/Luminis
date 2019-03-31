const { client, Discord, config } = require('../../require.js');

client.on('roleCreate', role => {

    if(config.logs.roleCreate.active == true) {

        let embed = new Discord.RichEmbed()
            .setAuthor("Rôle Créé", role.guild.iconURL)
            .setColor(0xB5E655)
            .addField("Rôle", role.name, true)
            .addField("ID", role.id, true)
            .setTimestamp(Date.now())

        try {
            client.channels.get(config.logs.roleCreate.channel).send({embed});
        } catch(err) {
            role.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to log ; " + err);
        }

    }
});