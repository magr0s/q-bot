const { telegram } = require('../..')
const { tvParser, getChatsMember, randomizer } = require('../../utils')

const {
  GROUPS,
  SEND_OPTIONS
} = require('../../configs/bot.json')

const { ACL_CHAT_MEMBER } = require('../../configs/acls.json')
const { TV_MENTION } = require('../../configs/tvs.json')

const {
  MSG_ANSWER_FAILURE,
  MSG_ANSWER_SUCCESS,
  MSG_MEMBER_WELCOME,
  MSG_NOT_CHAT_MEMBER,
  MSG_NOT_RESTRICTED
} = require('../../configs/msgs.json')

const textHandler = async ({ message, reply }, next) => {
  const {
    from: {
      id: memberId,
      username = '',
      first_name: firstName = '',
      last_name: lastName = ''
    },

    chat: { type },
    text
  } = message

  if (type !== 'private') return next()

  try {
    const group = (text[0] === '@' ? text.slice(1) : text).trim().toLowerCase()
    const success = GROUPS.includes(group)

    if (!success) return reply(MSG_ANSWER_FAILURE, SEND_OPTIONS)

    try {
      const { status } = await telegram.getChatMember(`@${group}`, memberId)
        .catch((error) => {
          throw new Error(MSG_NOT_CHAT_MEMBER)
        })

      if (status !== 'restricted') throw new Error(MSG_NOT_RESTRICTED)
    } catch ({ message }) {
      return reply(message, SEND_OPTIONS)
    }

    await telegram.restrictChatMember(`@${group}`, memberId, ACL_CHAT_MEMBER, 0)

    // TODO: Create message builder
    if (MSG_MEMBER_WELCOME) {
      const msgs = MSG_MEMBER_WELCOME[group] || MSG_MEMBER_WELCOME.defaults
      const memberName = `${firstName} ${lastName}`.trim() || username

      const memberMention = tvParser(TV_MENTION, {
        id: memberId,
        name: memberName
      })

      const welcomeMsg = tvParser(randomizer(msgs), { memberMention })

      await telegram.sendMessage(`@${group}`, welcomeMsg, SEND_OPTIONS)
    }

    return reply(MSG_ANSWER_SUCCESS, SEND_OPTIONS)
  } catch (error) {
    throw error
  }
}

module.exports = textHandler
