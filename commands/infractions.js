const { prefix, db, Discord, dateFns, dateFr } = require('../require.js');
const { COLORS, output } = require('../lib/functions.js');

module.exports = {
    name: 'infractions',
    category: 'mod',
    description: "Voir toutes les infractions d'un utilisateur",
    usage: `${prefix}infractions [warn|mute|kick|ban|all] [membre mentionné]`,
    exemple: `${prefix}infractions mute || ${prefix}infractions warn @Neshell#8701`,
    access: 'KICK_MEMBERS',
    async execute(message, args){
        let type = "";
        if(args[0]) type = args[0].toLowerCase();
        const member = message.mentions.members.first() || message.member;
        let number = 0;
        let list = "";

        const embed = new Discord.RichEmbed()
            .setAuthor(member.user.tag)
            .setColor(COLORS['cyan'])
            .setImage(message.guild.iconIRL)
            .setThumbnail(member.user.avatarURL)
            .setFooter(`Demandé par ${message.author.tag}`);

        switch(type) {
            case "warn":
                await db.from("infractions").where({discord_id: member.user.id, type: "warn"}).then((data) => {
                    if(!data[0]) list = "Aucun avertissement";
                    else {
                        data = data.sort((a, b) => { return b.id - a.id });
                        for(let infraction = 0; infraction < data.length; infraction++) {
                            number++;
                            if(number > 10) continue;
                            const created = dateFns.format(data[infraction].created, 'D/MM/YYYY à HH:mm UTCZ', { locale: dateFr });
                            list += `**Le ${created} par ${data[infraction].moderator}**\n${data[infraction].infraction}\n\n`;
                        }
                    }
                }).catch(err => {
                    output(`Error ; ${err}`);
                });

                embed.setTitle(`Nombre total d'avertissements : ${number}`)
                    .addField("Dix derniers avertissements :", list);
                break;
            case "mute":
                await db.from("infractions").where({discord_id: member.user.id, type: "mute"}).then((data) => {
                    if(!data[0]) list = "Aucun mute";
                    else {
                        data = data.sort((a, b) => { return b.id - a.id });
                        for(let infraction = 0; infraction < data.length; infraction++) {
                            number++;
                            if(number > 10) continue;
                            const created = dateFns.format(data[infraction].created, 'D/MM/YYYY à HH:mm UTCZ', { locale: dateFr });
                            list += `**Le ${created} par ${data[infraction].moderator} pendant ${data[infraction].duration}**\n${data[infraction].infraction}\n\n`;
                        }
                    }
                }).catch(err => {
                    output(`Error ; ${err}`);
                });

                embed.setTitle(`Nombre total de mutes : ${number}`)
                    .addField("Dix derniers mutes :", list);
                break;
            case "kick":
                await db.from("infractions").where({discord_id: member.user.id, type: "kick"}).then((data) => {
                    if(!data[0]) list = "Aucune exclusion";
                    else {
                        data = data.sort((a, b) => { return b.id - a.id });
                        for(let infraction = 0; infraction < data.length; infraction++) {
                            number++;
                            if(number > 10) continue;
                            const created = dateFns.format(data[infraction].created, 'D/MM/YYYY à HH:mm UTCZ', { locale: dateFr });
                            list += `**Le ${created} par ${data[infraction].moderator}**\n${data[infraction].infraction}\n\n`;
                        }
                    }
                }).catch(err => {
                    output(`Error ; ${err}`);
                });

                embed.setTitle(`Nombre total d'exclusions : ${number}`)
                    .addField("Dix dernières exclusions :", list);
                break;
            case "ban":
                await db.from("infractions").where({discord_id: member.user.id, type: "ban"}).then((data) => {
                    if(!data[0]) list = "Aucun bannissement";
                    else {
                        data = data.sort((a, b) => { return b.id - a.id });
                        for(let infraction = 0; infraction < data.length; infraction++) {
                            number++;
                            if(number > 10) continue;
                            const created = dateFns.format(data[infraction].created, 'D/MM/YYYY à HH:mm UTCZ', { locale: dateFr });
                            list += `**Le ${created} par ${data[infraction].moderator} pendant ${data[infraction].duration}**\n${data[infraction].infraction}\n\n`;
                        }
                    }
                }).catch(err => {
                    output(`Error ; ${err}`);
                });

                embed.setTitle(`Nombre total de bannissements : ${number}`)
                    .addField("Dix derniers bannissements :", list);
                break;
            default:
                await db.from("infractions").where({discord_id: member.user.id}).then((data) => {
                    if(!data[0]) list = "Aucune infraction";
                    else {
                        data = data.sort((a, b) => { return b.id - a.id });
                        for(let infraction = 0; infraction < data.length; infraction++) {
                            number++;
                            if(number > 10) continue;
                            const created = dateFns.format(data[infraction].created, 'D/MM/YYYY à HH:mm UTCZ', { locale: dateFr });
                            let durationText;
                            data[infraction].duration ? durationText = `pendant ${data[infraction].duration}` : durationText = "";
                            list += `**__[${data[infraction].type.toUpperCase()}]__ Le ${created} par ${data[infraction].moderator} ${durationText}**\n${data[infraction].infraction}\n\n`;
                        }
                    }
                }).catch(err => {
                    output(`Error ; ${err}`);
                });

                embed.setTitle(`Nombre total d'infractions : ${number}`)
                    .addField("Dix dernières infractions :", list);
        }

        message.channel.send({embed});
    }
}