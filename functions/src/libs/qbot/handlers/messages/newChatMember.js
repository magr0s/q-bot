const qbot = require('../../../qbot')
const { tvParser, randomizer } = require('../../utils')

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
      id: chatId,
      username: chatName
    },

    new_chat_member: {
      id: memberId,
      username,
      first_name: firstName = '',
      last_name: lastName = ''
    }
  } = message

  try {
    const {
      id: botId,
      username: botName
    } = await telegram.getMe()

    const { status: chatbotStatus } = await telegram.getChatMember(chatId, botId)

    if (
      botId === memberId ||
      chatbotStatus !== 'administrator'
    ) return next()

    const memberName = `${firstName} ${lastName}`.trim() || username

    // TODO: Create message builder
    const memberMention = tvParser(TV_MENTION, {
      id: memberId,
      name: memberName
    })

    const botMention = tvParser(TV_MENTION, {
      id: botId,
      name: `@${botName}`
    })

    const msgs = MSG_NEWBIE_WELCOME[chatName] || MSG_NEWBIE_WELCOME.defaults

    const welcomeMsg = tvParser(randomizer(msgs), {
      memberMention,
      botMention
    })

    await telegram.restrictChatMember(chatId, memberId, ACL_NEW_CHAT_MEMBER, 0)

    return reply(welcomeMsg, SEND_OPTIONS)
  } catch (error) {
    throw error
  }
}

module.exports = newChatMemberHandler
