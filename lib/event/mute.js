const { client, db, Discord, config } = require('../../require.js');
const { COLORS, output } = require('../functions.js');

client.on("mute", async (id, guild) => {
    try {
        await db.from("users").where({discord_id: id, actual_sanction: "muted"}).then(async data => {
            const user = data[0];
            if(!user) return;
            if(!user.expiration) return;

            const time = user.expiration;
            const now = Date.now();
            if(now >= time) {
                const member = guild.members.get(id);
                const muterole = guild.roles.find(role => role.name === config.muteRole.name);

                if(!member.roles.get(muterole.id)) {
                    await db.from("users").where({discord_id: id}).then(async dataB => {
                        if(dataB[0]) await db.update({pseudo: member.user.username, actual_sanction: null, created: null, expiration: null, reason: null}, 'id').into("users").where({discord_id: id});
                    });
                    return;
                }
                
                if(config.modLogs.mute.active == true){
                    const embed = new Discord.RichEmbed()
                        .setAuthor("[AUTO] Demute", guild.iconURL)
                        .setColor(COLORS['gold'])
                        .addField("Membre", member.user, true)
                        .setTimestamp(Date.now());
        
                    try {
                        client.channels.get(config.modLogs.mute.channel).send({embed});
                    } catch(err) {
                        guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
                        console.log("An error happened when trying to log ; " + err);
                    }
                }
        
                if(config.modLogs.mute.dm == true){
                    const embed = new Discord.RichEmbed()
                        .setAuthor("[AUTO] Demute", guild.iconURL)
                        .setColor(COLORS['gold'])
                        .setDescription("Vous avez été démute.")
                        .setTimestamp(Date.now());
        
                    try {
                        await member.user.send({embed});
                    } catch(err) {
                        guild.owner.send("An error happened when trying to DM ; " + err +"\n\nPlease contact bot author.");
                        console.log("An error happened when trying to DM ; " + err);
                    }
                }
        
                try {
                    await db.from("users").where({discord_id: id}).then(async dataB => {
                        if(dataB[0]) await db.update({pseudo: member.user.username, actual_sanction: null, created: null, expiration: null, reason: null}, 'id').into("users").where({discord_id: id});
                    });
                    await member.removeRole(muterole);
                } catch(err) {
                    guild.owner.send("An error happened when trying to demute ; " + err +"\n\nPlease contact bot author.");
                    console.log("An error happened when trying to demute ; " + err);
                }
            } else {
                setTimeout(() => {
                    client.emit("mute", id, guild);
                }, time - now);
            }
        });
    } catch(err) {
        output(err);
    }
});