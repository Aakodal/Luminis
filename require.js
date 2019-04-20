const Discord = require('discord.js');
const dotenv = require('dotenv');
const config = require('./config.json');
const dateFns = require('date-fns');
const database = require('quick.db');
const ms = require('ms');
const infos = require('./package.json');
dotenv.config({ path: './process.env' });

const server = {
    prefix: config.prefix,
    token: process.env.TOKEN,
    infos: infos,
    Discord: Discord,
    dateFns: dateFns,
    db: new database.table('sanctions'),
    ms: ms,
    client: new Discord.Client(),
    config: config,
    isNumber: number => !isNaN(+number) && !isNaN(number - 0)
}

module.exports = server;