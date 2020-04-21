const functions = require('firebase-functions')
const qbot = require('./libs/qbot')

const { telegram } = qbot

const {
  qbot: {
    url: QBOT_API,
    webhook_endpoint: QBOT_WEBHOOK_ENDPOINT
  }
} = functions.config()

const WEBHOOK_URL = QBOT_API + QBOT_WEBHOOK_ENDPOINT

telegram.setWebhook(WEBHOOK_URL)

qbot.use(
  require('./libs/qbot/handlers/middlewares'),
  require('./libs/qbot/handlers/messages')
)

const webhook = async ({ body }, res) => {
  try {
    const result = await qbot.handleUpdate(body, res)

    return !result && res.end()
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = webhook
