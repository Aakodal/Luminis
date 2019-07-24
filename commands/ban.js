const { prefix, client, db, Discord, config } = require('../require.js');
const { sendEmbed, sendError, COLORS, fetchUser } = require('../lib/functions.js');

module.exports = {
    name: 'ban',
    category: 'mod',
    description: "Bannit un utilisateur de façon permanente",
    usage: `${prefix}ban <membre mentionné|ID du membre> <raison>`,
    exemple: `${prefix}ban @Neshell#8701 Ceci est une raison`,
    access: 'BAN_MEMBERS',
    async execute(message, args){
        if(!args[1]) return sendError(`Mauvais usage de la commande.\n\n${prefix}ban <membre mentionné|ID du membre> <raison>`, message);

        let user;
        if(!message.mentions.users.first()) {
            user = await client.fetchUser(args[0]).then(info => info).catch(() => { return; });
        } else user = message.mentions.users.first();

        if(!user) return sendError("L'ID spécifié ne correspond à aucun utilisateur.", message);

        const reason = args.slice(1).join(" ");

        const member = message.guild.member(user);
        if(member) {
            const bot = message.guild.member(client.user);

            if(member.highestRole.comparePositionTo(message.member.highestRole) >= 0 || member.highestRole.comparePositionTo(bot.highestRole) >= 0) return sendError("Vous ne pouvez pas bannir un membre supérieur ou égal à vous ou à moi.", message);
            if(!member.bannable) return sendError("Ce membre ne peut pas être banni.", message);
        }

        if(user === message.author) return sendError("Vous ne pouvez pas vous bannir vous-même.", message);

        let isBanned;
        await message.guild.fetchBans()
            .then(bans => {
                if(bans.get(user.id)) isBanned = true;
            }).catch(err => { return err });

        if(isBanned) return sendError("Ce membre est déjà banni.", message);

        sendEmbed({author: "Modération", avatar: 'server', title: "Ban", color: 'light_green', text: `${user} a été banni pour la raison suivante :\n\n${reason}`, message});

        if(config.modLogs.ban.active == true){
            const embed = new Discord.RichEmbed()
                .setAuthor("Ban", message.guild.iconURL)
                .setColor(COLORS['cyan'])
                .addField("Membre", user, true)
                .addField("Modérateur", message.author, true)
                .addField("Raison", reason, false)
                .setTimestamp(Date.now())

            try {
                client.channels.get(config.modLogs.ban.channel).send({embed});
            } catch(err) {
                message.guild.owner.send("An error happened when trying to log ; " + err +"\n\nPlease contact bot author.");
                console.log("An error happened when trying to log ; " + err);
            }
        }

        if(config.modLogs.ban.dm == true){
            if(message.guild.members.get(user)) {
                const embed = new Discord.RichEmbed()
                    .setAuthor("Ban", message.guild.iconURL)
                    .setColor(COLORS['cyan'])
                    .addField("Modérateur", message.author, true)
                    .addField("Raison", reason, false)
                    .setTimestamp(Date.now())

                try {
                    await user.send({embed});
                } catch(err) {
                    message.guild.owner.send("An error happened when trying to DM ; " + err +"\n\nPlease contact bot author.");
                    console.log("An error happened when trying to DM ; " + err);
                }
            }
        }

        try {
            await db.insert({discord_id: user.id,
                pseudo: user.tag.replace(' ', ''),
                infraction: reason,
                type: "ban",
                created: Date.now(),
                duration: "PERMANENT",
                moderator: message.author.tag
            }, 'id').into("infractions");

            await db.from("users").where({discord_id: user.id}).then(async data => {
                if(!data[0]) await db.insert({discord_id: user.id}).into("users");
            });

            await db.update({pseudo: user.tag.replace(' ', ''),
                actual_sanction: "banned",
                created: Date.now(),
                reason: reason
            }, 'id').into("users").where({discord_id: user.id});
            
            await message.guild.ban(user, { reason: reason });
        } catch(err) {
            message.guild.owner.send("An error happened when trying to ban ; " + err +"\n\nPlease contact bot author.");
            console.log("An error happened when trying to ban ; " + err);
        }
    }
}