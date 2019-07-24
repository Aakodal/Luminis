const { client, db, config } = require('../require.js');
const { output } = require('./functions.js');

client.on('ready', async () => {
    await db.schema.hasTable("infractions").then(exists => {
        if(!exists) {
            db.schema.createTable("infractions", table => {
                table.increments('id').primary();
                table.string('discord_id');
                table.string("pseudo")
                table.text("infraction");
                table.enum("type", ["warn", "mute", "kick", "ban"]);
                table.timestamp("created");
                table.timestamp("expiration");
                table.string("duration");
                table.string("moderator");
            }).then(() => {
                output("Création de la table infractions réussie.");
            }).catch(err => {
                output(err);
            });
        }
    });

    await db.schema.hasTable("users").then(exists => {
        if(!exists) {
            db.schema.createTable("users", table => {
                table.increments('id').primary();
                table.string('discord_id');
                table.string("pseudo")
                table.timestamp("last_warn");
                table.enum("actual_sanction", ["muted", "banned" ]);
                table.timestamp("created");
                table.timestamp("expiration");
                table.text("reason");
            }).then(() => {
                output("Création de la table users réussie.");
            }).catch(err => {
                output(err);
            });
        }
    });

    await db.from("users").where({actual_sanction: "muted"}).then(data => {
        if(!data[0]) return;
        const guild = client.guilds.get(config.server);
        data.forEach(async user => {
            if(user.expiration) {
                await client.emit("mute", user.discord_id, guild);
            }
        });
    });

    await db.from("users").where({actual_sanction: "banned"}).then(data => {
        if(!data[0]) return;
        const guild = client.guilds.get(config.server);
        data.forEach(async user => {
            if(user.expiration) {
                await client.emit("ban", user.discord_id, guild);
            }
        });
    });
});