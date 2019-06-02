const { client, Discord, config } = require('../../require.js');

client.on('guildMemberUpdate', (oldMember, newMember) => {

    if(config.logs.userUpdate.active == true) {

        const embed = new Discord.RichEmbed()
            .setAuthor("User Updated", newMember.user.avatarURL)
            .setColor(0xFF6600)
            .addField("Membre", newMember.user, false)
            .setTimestamp(Date.now());

        if(oldMember.nickname !== newMember.nickname){
            embed.addField("Ancien pseudonyme", oldMember.nickname, true)
                .addField("Nouveau pseudonyme", newMember.nickname, true);
        }

        const oldRoles = oldMember.roles.array().length >= 2
            ? oldMember.roles.array().slice(1) // On retire @everyone
            : oldMember.roles.array().shift(); // On ne garde que @everyone
        const newRoles = newMember.roles.array().length >= 2
            ? newMember.roles.array().slice(1) // retire @everyone
            : newMember.roles.array().shift(); // garde @everyone

        const oldIds = oldRoles
            .map(role => role.id) // .map() effectue une fonction sur chaque élément du tableau (ici on get l'id)
            // .reduce() accumule (acc) des valeurs pour n'en former qu'une
            .reduce((acc, now) => acc + +now); // ici, on additionne chaque ID pour ne former qu'une valeur
        const newIds = newRoles
            .map(role => role.id) // get des id
            .reduce((acc, now) => acc + +now); // addition de chaque ID

        if(oldRoles.length !== newRoles.length || oldIds !== newIds){
            embed.addField("Ancien(s) rôle(s)", oldRoles, false)
                .addField("Nouveau(x) rôle(s)", newRoles, false);
        }

        try {
            client.channels.get(config.logs.userUpdate.channel).send({embed});
        } catch(err) {
            newMember.guild.owner.send(`An error happened when trying to log ; ${err}\n\nPlease contact bot author.`);
            console.log(`An error happened when trying to log ; ${err}`);
        }

    }
});
