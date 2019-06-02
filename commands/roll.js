const { prefix } = require('../require.js');
const { sendEmbed, sendError, randInt } = require('../lib/functions.js');

module.exports = {
    name: 'roll',
    description: "Lance un dé virtuel",
    usage: prefix+'roll [nombre]d<nombre>',
    exemple: prefix+'roll 1d6 || !roll d6',
    execute(message, args){
        const randSentence = {
            '1': "Expecto patronum!",
            '2': "Wingardium leviosa!",
            '3': "Waddiwasi!",
            '4': "Rictusempra!",
            '5': "Riddikulus!",
            '6': "Finite incantatem!",
            '7': "Confundo!",
            '8': "Levicorpus!",
            '9': "Tarentallegra!"
        }

        if(!args[1]) {
            return sendError("Veuillez insérer un argument.", message);
        }

        const parameter = args[1].split('d');
        const randPhr = randInt(1, Object.values(randSentence).length);
        if(parameter[0] == '') { // ['', 'number']
            if(typeof parseInt(parameter[1]) != "number" || isNaN(parameter[1])) {
                return message.channel.send(randSentence[randPhr]);
            }
            if(parameter[1] > 10000) {
                return sendError("Limite trop grande. Veuillez ne pas dépasser 10,000.", message);
            }

            const random = randInt(1, parameter[1]);
            sendEmbed({color: 'orange', text: `🎲 ${random}`, message});

        } else if(typeof parseInt(parameter[0]) == "number" && !isNaN(parameter[0])) { // ['number', 'number']
            if(typeof parseInt(parameter[1]) != "number" || isNaN(parameter[1])) {
                return message.channel.send(randSentence[randPhr]);
            }
            if(parameter[0] > 100) {
                return sendError("Nombre de dés trop grand. Veuillez ne pas dépasser 100.", message);
            }
            if(parameter[1] > 10000) {
                return sendError("Limite trop grande. Veuillez ne pas dépasser 10,000.", message);
            }

            let list = [];
            for(i = 0; i < parameter[0]; i++) {
                const random = randInt(1, parameter[1]);
                list[i] = random;
            }
            const total = list.reduce((acc, now) => acc + now);

            sendEmbed({color: 'orange', text: `🎲 ( ${list.join(" + ")} ) = ${total}`, message});

        } else {
            return message.channel.send(randSentence[randPhr]);
        }
    }
}