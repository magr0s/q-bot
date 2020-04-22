const { getChatsMember } = require('../../utils')

const { SEND_OPTIONS } = require('../../configs/bot.json')
const { MSG_UNKNOW_MEMBER } = require('../../configs/msgs.json')

const anonymous = async ({ message, reply }, next) => {
  const {
    chat: {
      type
    },

    from: {
      id: memberId
    }
  } = message

  if (type !== 'private') return next()

  try {
    const member = await getChatsMember(memberId)

    if (member === false) return reply(MSG_UNKNOW_MEMBER, SEND_OPTIONS)

    return next()
  } catch (error) {
    throw error
  }
}

module.exports = anonymous
