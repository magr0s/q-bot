const functions = require('firebase-functions')
const Telegraf = require('telegraf')

const {
  qbot: {
    access_token: QBOT_ACCESS_TOKEN
  }
} = functions.config()

const qbot = new Telegraf(QBOT_ACCESS_TOKEN)

module.exports = qbot
