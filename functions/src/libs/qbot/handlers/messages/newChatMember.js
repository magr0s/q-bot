const qbot = require('../../../qbot')
const { tvParser } = require('../../utils')

const { SEND_OPTIONS } = require('../../configs/bot.json')
const { TV_MENTION } = require('../../configs/tvs.json')
const { ACL_NEW_CHAT_MEMBER } = require('../../configs/acls.json')

const {
  MSG_NEWBIE_WELCOME
} = require('../../configs/msgs.json')

const { telegram } = qbot

const newChatMemberHandler = async ({ message, reply }, next) => {
  const {
    chat: {
      id: chatId
    },

    new_chat_member: {
      id: memberId,
      username,
      first_name: firstName = '',
      last_name: lastName = ''
    }
  } = message

  try {
    // TODO: Refactor to context
    const me = await telegram.getMe()

    await telegram.restrictChatMember(chatId, memberId, ACL_NEW_CHAT_MEMBER, 0)

    const memberName = `${firstName} ${lastName}`.trim() || username

    // TODO: Create message builder
    const memberMention = tvParser(TV_MENTION, {
      id: memberId,
      name: memberName
    })

    const {
      id: botId,
      username: botName
    } = me

    const botMention = tvParser(TV_MENTION, {
      id: botId,
      name: `@${botName}`
    })

    const welcomeMsg = tvParser(MSG_NEWBIE_WELCOME, {
      memberMention,
      botMention
    })

    return reply(welcomeMsg, SEND_OPTIONS)
  } catch (error) {
    throw error
  }
}

module.exports = newChatMemberHandler
