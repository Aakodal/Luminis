const { prefix, client } = require('../require.js');
const { sendEmbed, randInt } = require('../lib/functions.js');

module.exports = {
    name: 'rps',
    aliases: [ 'rockpaperscissors' ],
    category: 'fun',
    description: "Jouer à une partie de Pierre Papier Ciseaux !",
    usage: `${prefix}rps`,
    exemple: `${prefix}rps`,
    execute(message, args){
        const embed = sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'orange', text: "Pierre, Papier, Ciseaux !"})
        message.channel.send(embed).then(async embedMessage => {
            await embedMessage.react('💎');
            await embedMessage.react('📄');
            await embedMessage.react('✂');
            await embedMessage.react('🚪');

            const botTurn = randInt(1, 3);

            client.on('messageReactionAdd', (reaction, user) => {
                if(reaction.message.id !== embedMessage.id || user !== message.author || user.bot || '💎📄✂🚪'.indexOf(reaction.emoji.name) < 0) return;

                embedMessage.delete();
                let answer;
                const reactions = {
                    '💎': () => answer = 1,
                    '📄': () => answer = 2,
                    '✂': () => answer = 3,
                    '🚪': () => answer = 4
                }
                if (reactions[reaction.emoji.name]) reactions[reaction.emoji.name]();

                const end = {
                    '1': {
                        '1': () => sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'cyan', message, text: "💎 vs 💎 : Égalité !"}),
                        '2': () => sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'light_red', message, text: "💎 vs 📄 : Défaite !"}),
                        '3': () => sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'light_green', message, text: "💎 vs ✂ : Victoire !"})
                    },
                    '2': {
                        '1': () => sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'light_green', message, text: "📄 vs 💎 : Victoire !"}),
                        '2': () => sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'cyan', message, text: "📄 vs 📄 : Égalité !"}),
                        '3': () => sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'light_red', message, text: "📄 vs ✂ : Défaite !"})
                    },
                    '3': {
                        '1': () => sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'light_red', message, text: "✂ vs 💎 : Défaite !"}),
                        '2': () => sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'light_green', message, text: "✂ vs 📄 : Victoire !"}),
                        '3': () => sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'cyan', message, text: "✂ vs ✂ : Égalité !"})
                    }
                }

                if(answer === 4) return sendEmbed({author: "Rock Paper Scissors", avatar: "client", color: 'orange', message, text: "Vous avez mis fin à la partie."});

                return end[answer][botTurn]();
            });
        });
    }
}