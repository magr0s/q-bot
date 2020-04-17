const { isChatsMember } = require('../../utils')

const { SEND_OPTIONS } = require('../../configs/bot.json')
const { MSG_UNKNOW_MEMBER } = require('../../configs/msgs.json')

const anonymous = async ({ message, reply }, next) => {
  const {
    chat: {
      id: chatId,
      type
    },

    from: {
      id: memberId
    }
  } = message

  if (type !== 'private') return next()

  try {
    const isMember = await isChatsMember(memberId)

    if (!isMember) return reply(MSG_UNKNOW_MEMBER, SEND_OPTIONS)

    return next()
  } catch (error) {
    throw error
  }
}

module.exports = anonymous
