const { prefix, client, Discord } = require('../require.js');
const { createEmbed } = require('../lib/functions.js');

module.exports = {
    name: 'userinfo',
    aliases: [ 'whois' ],
    description: "Affiche diverses informations à propos de vous ou du membre mentionné",
    usage: prefix+'userinfo [membre mentionné]',
    exemple: prefix+'userinfo | ' + prefix + 'userinfo @Neshell#8701',
    execute(message, args){
        let member;
        if(args[1]){
            member = message.mentions.members.first();
        } else {
            member = message.member;
        }

        let roleColor;
        member.roles.forEach(role => {
            if(role.color) roleColor = role.color;
        })
        
        if(member){

            let embed = new Discord.RichEmbed()
                .setAuthor(member.user.tag, member.user.avatarURL)
                .setColor(roleColor)
                .setThumbnail(member.user.avatarURL)
                .setFooter("Demandé par " + message.author.tag, message.author.avatarURL)

                .addField("Nom", member.user.username, true)
                .addField("Surnom", member.displayName, true)
                .addField("Identifiant", member.user.id, true)
                .addField("Jeu", member.user.presence.game ? "Joue à **" + member.user.presence.game + "**" : "Rien", true)
                .addField("Status", member.user.presence.status.replace("online", "En ligne").replace("offline", "Hors-ligne").replace("idle", "AFK").replace("dnd", "Ne pas déranger"), true)
                .addField("Bot", member.user.bot ? "Oui" : "Non", true)
                .addField("Date de création", member.user.createdAt, true)
                .addField("Date d'invitation", member.joinedAt, true)
                .addField("Propriétaire du serveur", message.guild.ownerID === member.user.id ? "Oui" : "Non", true)
                .addField("Administrateur", member.hasPermission('ADMINISTRATOR') ? "Oui" : "Non", true)
                .addField("Rôles", member.roles.array().slice(1, member.roles.array().length).join(", "), false)
                
            message.channel.send({embed});

        } else {
            text = "Mauvais usage de la commande:\n\n"+ prefix +"userinfo\n"+ prefix +"userinfo <membre mentionné>.";
            message.channel.send(createEmbed("Erreur", 'server', '', 'dark_red', text, message));
        }
    }
}