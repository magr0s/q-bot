const Telegraf = require('telegraf')

const qbot = new Telegraf(process.env.BOT_ACCESS_TOKEN)

module.exports = qbot
