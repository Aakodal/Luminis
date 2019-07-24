const { prefix, db, Discord, client, dateFns, dateFr, ms } = require('../require.js');
const { COLORS } = require('../lib/functions.js');

module.exports = {
    name: 'banlist',
    category: 'mod',
    description: "Voir tous les bans du serveur",
    usage: `${prefix}banlist`,
    exemple: `${prefix}banlist`,
    access: 'KICK_MEMBERS',
    async execute(message, args){
        let embed = new Discord.RichEmbed()
            .setAuthor(message.guild.name)
            .setColor(COLORS['cyan'])
            .setImage(message.guild.iconIRL)
            .setTimestamp(Date.now())
            .addField("Si l'emoji ⚠ se manifeste :", `Cela signifie que l'utilisateur est noté banni dans la DB mais ne l'est pas sur le serveur.
            Si cet emoji s'affiche en double, cela signifie l'inverse.`);

        let stockEmbeds = [];
        const updateReactions = (message, page) => {
            if(stockEmbeds.length > 1){
                if (page === 0) {
                    [...'➡⏭'].forEach((emoji, index) => {
                        setTimeout(() => {
                            message.react(emoji)
                        }, index * 1000)
                    });
                } else if (page === stockEmbeds.length - 1) {
                    [...'⏮⬅'].forEach((emoji, index) => {
                        setTimeout(() => {
                            message.react(emoji)
                        }, index * 1000)
                    });
                } else {
                    [...'⏮⬅➡⏭'].forEach((emoji, index) => {
                        setTimeout(() => {
                            message.react(emoji)
                        }, index * 1000)
                    });
                }
            }
        }

        const bans = await message.guild.fetchBans(true).then(bans => bans).catch(() => { return; });
        await bans.forEach(async banned => {
            await db.from("users").where({discord_id: banned.user.id}).then(data => {
                if(!data[0] || data[0].actual_sanction !== "banned") {
                    embed.addField(`⚠⚠ ${banned.user.username}#${banned.user.discriminator} (${banned.user.id})`, banned.reason);
                    
                    if(embed.fields.length % 6 === 0){
                        stockEmbeds.push(embed);
                        embed = new Discord.RichEmbed()
                            .setAuthor(message.guild.name)
                            .setColor(COLORS['cyan'])
                            .setImage(message.guild.iconIRL)
                            .setTimestamp(Date.now())
                            .addField("Si l'emoji ⚠ se manifeste :", `Cela signifie que l'utilisateur est noté banni dans la DB mais ne l'est pas sur le serveur.
                            Si cet emoji s'affiche en double, cela signifie l'inverse.`);
                    }
                }
            });
        });
        await db.from('users').where({actual_sanction: 'banned'}).then(data => {
            data.forEach(user => {
                client.fetchUser(user.discord_id).then(info => {
                    if (!info) return;
                    const created = dateFns.format(
                        user.created,
                        'D/MM/YYYY à HH:mm UTCZ',
                        {locale: dateFr}
                    );
                    const duration = user.expiration
                        ? `pendant ${ms(user.expiration - user.created)}`
                        : '';
                    const avert = bans.get(user.discord_id) ? '' : '⚠ ';

                    embed.addField(
                        `${avert}${info.username}#${info.discriminator} (${info.id}) le ${created} ${duration}`,
                        user.reason
                    );

                    if (embed.fields.length % 6 === 0) {
                        stockEmbeds.push(embed);
                        embed = new Discord.RichEmbed()
                        .setAuthor(message.guild.name)
                        .setColor(COLORS['cyan'])
                        .setImage(message.guild.iconIRL)
                        .setTimestamp(Date.now())
                        .addField(
                            "Si l'emoji ⚠ se manifeste :",
                            `Cela signifie que l'utilisateur est noté banni dans la DB mais ne l'est pas sur le serveur.
                        Si cet emoji s'affiche en double, cela signifie l'inverse.`
                        );
                    }
                }).catch(console.error);
            });
        });

        if(embed.fields.values().next().value) stockEmbeds.push(embed);
        
        stockEmbeds.forEach((page, index) => {
            page.setTitle(`Commandes disponibles - Page ${index + 1} sur ${stockEmbeds.length}`);
            page.setFooter("Demandé par " + message.author.tag, message.author.avatarURL);
        });
    
        let currentPage = 0;
        let author = message.author;
        
        message.channel.send(stockEmbeds[currentPage]).then(embedMessage => {
            updateReactions(embedMessage, currentPage);

            client.on("messageReactionAdd", (reaction, user) => {
                if(reaction.message.id !== embedMessage.id || user !== author || user.bot || '⏮⬅➡⏭'.indexOf(reaction.emoji.name) < 0) return;
                const reactions = {
                    '⏮': () => currentPage = 0,
                    '⬅': () => currentPage--,
                    '➡': () => currentPage++,
                    '⏭': () => currentPage = stockEmbeds.length - 1
                }
                if (reactions[reaction.emoji.name]) reactions[reaction.emoji.name]();

                embedMessage.clearReactions().then(() => {
                    embedMessage.edit(stockEmbeds[currentPage]);
                    updateReactions(embedMessage, currentPage);
                });
            });
        }).catch(err => {
            sendError(`Une erreur est survenue :\n\n${err}`, message);
        });
    }
}