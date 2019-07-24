const { client, db, Discord, config } = require('../../require.js');
const { COLORS, output } = require('../functions.js');

client.on("ban", async (id, guild) => {
    try {
        await db.from("users").where({discord_id: id, actual_sanction: "banned"}).then(async data => {
            const user = data[0];
            if(!user) return;
            if(!user.expiration) return;

            const time = user.expiration;
            const now = Date.now();
            if(now >= time) {
                client.fetchUser(id).then(async info => {
                    let isBanned = false;
                    await guild.fetchBans()
                        .then(bans => {
                            if(bans.get(info.id)) isBanned = true;
                        }).catch(err => { return err });

                    if(!isBanned) {
                        await db.from("users").where({discord_id: id}).then(async dataB => {
                            if(dataB[0]) await db.update({pseudo: info.tag, actual_sanction: null, created: null, expiration: null, reason: null}, 'id').into("users").where({discord_id: id});
                        });
                        return;
                    }
                    
                    if(config.modLogs.ban.active == true){
                        const embed = new Discord.RichEmbed()
                            .setAuthor("[AUTO] Deban", guild.iconURL)
                            .setColor(COLORS['gold'])
                            .addField("Membre", user, true)
                            .setTimestamp(Date.now());
            
                        try {
                            client.channels.get(config.modLogs.ban.channel).send({embed});
                        } catch(err) {
                            guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
                            console.log("An error happened when trying to log ; " + err);
                        }
                    }
            
                    try {
                        await db.from("users").where({discord_id: id}).then(async dataB => {
                            if(dataB[0]) await db.update({pseudo: info.tag, actual_sanction: null, created: null, expiration: null, reason: null}, 'id').into("users").where({discord_id: id});
                        });
                        await guild.unban(info);
                    } catch(err) {
                        guild.owner.send("An error happened when trying to deban ; " + err +"\n\nPlease contact bot author.");
                        console.log("An error happened when trying to deban ; " + err);
                    }
                }).catch(() => { return; });
            } else {
                setTimeout(() => {
                    client.emit("ban", id, guild);
                }, time - now);
            }
        });
    } catch(err) {
        output(err);
    }
});