const { prefix, Discord, client, config } = require('../require.js');
const { sendError } = require('../lib/functions.js');

module.exports = {
    name: 'vote',
    category: 'admin',
    description: "Propose un vote dans le salon configuré.",
    usage: `${prefix}vote <title> <text>`,
    exemple: `${prefix}vote Promotion On passe @Neshell#8701 modérateur ?`,
    access: 'ADMINISTRATOR',
    async execute(message, args){
        if(!args[1]) return sendError("Veuillez préciser un vote à proposer.", message);

        const vote = args.slice(1).join(" ");

        const embed = new Discord.RichEmbed()
            .setAuthor("Nouveau vote proposé", message.guild.iconURL)
            .setColor(0xFFCC00)
            .setTitle(args[0])
            .setDescription(vote);

        if(!config.votes.anonyme) embed.setFooter("Vote proposé par " + message.author.tag, message.author.avatarURL);

        client.channels.get(config.votes.channel).send({embed}).then(async (embedMsg) => {
            await embedMsg.react('✅');
            await embedMsg.react('❌');
            await embedMsg.react('◻'); // carré blanc
        }).catch(err => {
            sendError(`Une erreur est survenue ;\n\n${err}`, message);
        });
    }
}