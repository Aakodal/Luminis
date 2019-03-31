const { client, Discord, config } = require('../../require.js');

client.on('roleUpdate', (old, role) => {

    if(config.logs.roleUpdate.active == true) {

        if(role.name != "@everyone") {

            let embed = new Discord.RichEmbed()
                .setAuthor("Rôle Édité", role.guild.iconURL)
                .setColor(role.hexColor)
                .setTimestamp(Date.now())

            if(old.name !== role.name) {
                embed.addField("*Ancien nom*", old.name, false)
                embed.addField("*Nouveau nom*", role.name, false)
            }
            
            if(old.hoist !== role.hoist) {
                embed.addField("**Anciennement séparé**", old.hoist ? "Oui" : "Non", false)
                embed.addField("**Nouvellement séparé**", role.hoist ? "Oui" : "Non", false)
            }

            if(old.mentionable !== role.mentionable) {
                embed.addField("__Anciennement mentionnable__", old.mentionable ? "Oui" : "Non", false)
                embed.addField("__Nouvellement mentionnable__", role.mentionable ? "Oui" : "Non", false)
            }
            
            if(old.permissions !== role.permissions) {
                embed.addField("*__Anciennes permissions__*", old.permissions, false)
                embed.addField("*__Nouvelles permissions__*", role.permissions, false)
            }

            if(old.hexColor !== role.hexColor) {
                embed.addField("**__Ancienne couleur__**", old.hexColor, false)
                embed.addField("**__Nouvelle couleur__**", role.hexColor, false)
            }


            try {
                client.channels.get(config.logs.roleUpdate.channel).send({embed});
            } catch(err) {
                role.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
                console.log("An error happened when trying to log ; " + err);
            }

        }

    }
});