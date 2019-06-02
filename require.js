const Discord = require('discord.js');
const config = require('./config.json');
const dateFns = require('date-fns');
const dateFr = require('date-fns/locale/fr');
const fs = require('fs');
const infos = require('./package.json');

const server = {
    prefix: config.prefix,
    token: config.token,
    infos: infos,
    Discord: Discord,
    dateFns: dateFns,
    dateFr: dateFr,
    fs: fs,
    client: new Discord.Client(),
    config: config,
    isNumber: number => !isNaN(+number) && !isNaN(number - 0)
}

module.exports = server;