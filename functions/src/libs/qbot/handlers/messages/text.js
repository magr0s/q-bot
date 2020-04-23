const { telegram } = require('../..')
const { tvParser, getChatsMember, randomizer } = require('../../utils')

const { SEND_OPTIONS } = require('../../configs/bot.json')
const { ACL_CHAT_MEMBER } = require('../../configs/acls.json')
const { TV_MENTION } = require('../../configs/tvs.json')

const {
  MSG_ANSWER_FAILURE,
  MSG_ANSWER_SUCCESS,
  MSG_MEMBER_WELCOME
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
    const { status, group } = await getChatsMember(memberId)
    const isRestricted = status === 'restricted'

    if (!isRestricted) return next()

    const text_ = text.trim().toLowerCase()

    const success = text_ === group || text_ === `@${group}`

    if (success) {
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
    }

    const msg = success ? MSG_ANSWER_SUCCESS : MSG_ANSWER_FAILURE

    return reply(msg, SEND_OPTIONS)
  } catch (error) {
    throw error
  }
}

module.exports = textHandler
