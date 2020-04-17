const qbot = require('../..')
const { Concierge, tvParser } = require('../../utils')

const { SEND_OPTIONS } = require('../../configs/bot.json')
const { TV_MENTION } = require('../../configs/tvs.json')
const { ACL_NEW_CHAT_MEMBER } = require('../../configs/acls.json')

const {
  MSG_NEED_VERIFY,
  MSG_NEWBIE_WELCOME
} = require('../../configs/msgs.json')

const { telegram } = qbot

const newChatMemberHandler = async ({ message, reply }, next) => {
  const {
    chat: {
      id: chatId,
      username: chatName
    },

    new_chat_member: {
      id: memberId,
      username,
      first_name: firstName,
      last_name: lastName
    }
  } = message

  const question = Concierge.getQuestion(`${chatName}`)

  try {
    await Promise.all([
      telegram.restrictChatMember(chatId, memberId, ACL_NEW_CHAT_MEMBER, 0),
      telegram.sendMessage(memberId, MSG_NEED_VERIFY, SEND_OPTIONS)
    ])

    // TODO: Create message builder
    if (MSG_NEWBIE_WELCOME) {
      const memberName = `${firstName} ${lastName}`.trim() || username

      const mention = tvParser(TV_MENTION, {
        id: memberId,
        name: memberName
      })

      const welcomeMsg = tvParser(MSG_NEWBIE_WELCOME, { mention })

      return reply(welcomeMsg, SEND_OPTIONS)
    }

    await telegram.sendMessage(memberId, question, SEND_OPTIONS)

    return next()
  } catch (error) {
    throw error
  }
}

module.exports = newChatMemberHandler
