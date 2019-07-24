const { prefix, Discord, dateFns, dateFr } = require('../require.js');
const { sendError } = require('../lib/functions.js');

module.exports = {
    name: 'userinfo',
    category: 'else',
    aliases: [ 'whois' ],
    description: "Affiche diverses informations à propos de vous ou du membre mentionné",
    usage: `${prefix}userinfo [membre mentionné]`,
    exemple: `${prefix}userinfo | ${prefix}userinfo @Neshell#8701`,
    execute(message, args){
        const member = message.mentions.members.first() || message.member;

        let roleColor;
        member.roles.forEach(role => {
            if(role.color) roleColor = role.color;
        })
        
        if(!member) return sendError(`Mauvais usage de la commande :\n\n${prefix} userinfo\n${prefix} userinfo <membre mentionné>.`, message);

        const created = dateFns.format(member.user.createdAt, 'dddd D MMMM YYYY à HH:mm', { locale: dateFr });
        const joined = dateFns.format(member.joinedAt, 'dddd D MMMM YYYY à HH:mm', { locale: dateFr });

        const embed = new Discord.RichEmbed()
            .setAuthor(member.user.tag, member.user.avatarURL)
            .setColor(roleColor)
            .setThumbnail(member.user.avatarURL)
            .setFooter("Demandé par " + message.author.tag, message.author.avatarURL)

            .addField("Nom", member.user.username, true)
            .addField("Surnom", member.displayName, true)
            .addField("Identifiant", member.user.id, true)
            .addField("Jeu", member.user.presence.game ? member.user.presence.game : "Rien", true)
            .addField("Status", member.user.presence.status.replace("online", "En ligne").replace("offline", "Hors-ligne").replace("idle", "AFK").replace("dnd", "Ne pas déranger"), true)
            .addField("Bot", member.user.bot ? "Oui" : "Non", true)
            .addField("Date de création", created.charAt(0).toUpperCase() + created.slice(1), true)
            .addField("Date d'invitation", joined.charAt(0).toUpperCase() + joined.slice(1), true)
            .addField("Propriétaire du serveur", message.guild.ownerID === member.user.id ? "Oui" : "Non", true)
            .addField("Administrateur", member.hasPermission('ADMINISTRATOR') ? "Oui" : "Non", true)
            .addField("Rôles", member.roles.array().length > 1 ? member.roles.array().slice(1, member.roles.array().length).join(", ") : "Aucun", false)
            
        message.channel.send({embed});

    }
}