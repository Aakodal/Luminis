const Discord = require('discord.js');
const dotenv = require('dotenv');
const config = require('./config.json');
dotenv.config({ path: './process.env' });

const server = {
    prefix: config.prefix,
    token: process.env.TOKEN,
    Discord: Discord,
    client: new Discord.Client(),
    config: config
}

module.exports = server;