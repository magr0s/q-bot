const { SEND_OPTIONS } = require('../../configs/bot.json')
const { MSG_VALIDATE } = require('../../configs/msgs.json')

const start = async ({ message, reply }, next) => {
  const {
    chat: {
      type
    }
  } = message

  if (type !== 'private') return next()

  try {
    return reply(MSG_VALIDATE, SEND_OPTIONS)
  } catch (error) {
    throw error
  }
}

module.exports = start
