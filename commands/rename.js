const { prefix, client } = require('../require.js');
const { sendEmbed, sendError } = require('../lib/functions.js');

module.exports = {
    name: 'rename',
    aliases: [ 'pseudo' ],
    description: "Renomme un membre",
    usage: `${prefix}rename <membre mentionné> <surnom>`,
    exemple: `${prefix}rename @Neshell#8701 Dieu vivant`,
    access: 'MANAGE_NICKNAMES',
    execute(message, args){
        if(args[1]) {

            const user = message.mentions.users.first();
            if(user) {

                const member = message.guild.member(user);
                const bot = message.guild.member(client.user);
                if(member) {

                    if(member.highestRole.comparePositionTo(message.member.highestRole) < 0 && member.highestRole.comparePositionTo(bot.highestRole) < 0) {

                        const nick = args.slice(1).join(" ");
                        if(nick.length <= 32) {

                            if(member.nickname !== nick) {

                                try {
                                    member.setNickname(nick).then(() => {
                                        sendEmbed({author: "Surnom", avatar: 'server', color: 'light_green', text: `Le surnom de ${user.tag} est désormais \`${nick}\`.`, message});
                                    }).catch(err => {
                                        console.log("An error happened when trying to send message ; " + err);
                                        message.guild.owner.send("An error happened when trying to send message ; " + err);
                                    });
                                } catch(err) {
                                    console.log("An error happened when trying to rename someone ; " + err);
                                    message.guild.owner.send("An error happened when trying to rename someone ; " + err);
                                }

                            } else {
                                sendError("Pourquoi remettre le même pseudonyme exactement ?", message);
                            }

                        } else {
                            sendError("Le surnom ne doit pas dépasser 32 caractères.", message);
                        }

                    } else {
                        sendError("Vous ne pouvez pas renommer une personne supérieure ou égale à vous.", message);
                    }

                } else {
                    sendError("Ce membre n'existe pas ou n'est pas sur le serveur.", message);
                }

            } else {
                sendError("Veuillez mentionner le membre à mentionner.", message);
            }

        } else {
            sendError(`Mauvais usage de la commande.\n\n${prefix}rename <membre mentionné> <surnom>`, message);
        }
    }
}