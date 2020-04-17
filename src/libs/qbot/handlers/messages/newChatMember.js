const qbot = require('../..')
const { Concierge } = require('../../utils')

const { SEND_OPTIONS } = require('../../configs/bot.json')
const { ACL_NEW_CHAT_MEMBER } = require('../../configs/acls.json')
const { MSG_NEED_VERIFY } = require('../../configs/msgs.json')

const { telegram } = qbot

const newChatMemberHandler = async ({ message }, next) => {
  const {
    chat: {
      id: chatId,
      username: chatName
    },

    new_chat_member: {
      id: memberId
    }
  } = message

  try {
    await Promise.all([
      telegram.restrictChatMember(chatId, memberId, ACL_NEW_CHAT_MEMBER, 0),
      telegram.sendMessage(memberId, MSG_NEED_VERIFY, SEND_OPTIONS)
    ])

    const question = Concierge.getQuestion(`${chatName}`)

    await telegram.sendMessage(memberId, question, SEND_OPTIONS)

    return next()
  } catch (error) {
    throw error
  }
}

module.exports = newChatMemberHandler
