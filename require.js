const Discord = require('discord.js');
const config = require('./config.json');
const dateFns = require('date-fns');
const dateFr = require('date-fns/locale/fr');
const fs = require('fs');
const infos = require('./package.json');
const ms = require('ms');
const db = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './db.sql'
    },
    useNullAsDefault: true
});

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
    ms: ms,
    db: db,
    isNumber: number => !isNaN(+number) && !isNaN(number - 0)
}

module.exports = server;