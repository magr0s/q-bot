require('dotenv').config()

const qbot = require('./src/libs/qbot')

qbot.use(
  require('./src/libs/qbot/handlers/middlewares'),
  require('./src/libs/qbot/handlers/messages')
)

// Webhook settings https://telegraf.js.org/#/?id=webhooks

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const {
  API_URL,
  WEBHOOK_ENDPOINT
} = process.env

const WEBHOOK_URL = API_URL + WEBHOOK_ENDPOINT

const app = express()

app.use(bodyParser.json())
  .use(cors({ origin: true }))
  .use(WEBHOOK_ENDPOINT, (req, res) => {
    return qbot.handleUpdate(req.body, res)
      .then(result => (!result && res.end()))
  })
  .get('*', (_, res) => (
    res.status(404)
      .json({
        success: false,
        data: 'Error: Endpoint not found.'
      })
  ))

qbot.telegram.setWebhook(WEBHOOK_URL)

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
})
