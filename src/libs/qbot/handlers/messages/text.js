const { telegram } = require('../..')
const { Concierge, tvParser, findChatsMember } = require('../../utils')

const { SEND_OPTIONS } = require('../../configs/bot.json')
const { ACL_CHAT_MEMBER } = require('../../configs/acls.json')
const { TV_MENTION } = require('../../configs/tvs.json')
const { MSG_MEMBER_WELCOME } = require('../../configs/msgs.json')

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
    const { status, group } = await findChatsMember(memberId)
    const isRestricted = status === 'restricted'

    if (!isRestricted) return next()

    const { success, msg } = await Concierge.validate(memberId, text)

    if (success) {
      await telegram.restrictChatMember(`@${group}`, memberId, ACL_CHAT_MEMBER, 0)

      // TODO: Create message builder
      if (MSG_MEMBER_WELCOME) {
        const memberName = `${firstName} ${lastName}`.trim() || username

        const mention = tvParser(TV_MENTION, {
          id: memberId,
          name: memberName
        })

        const welcomeMsg = tvParser(MSG_MEMBER_WELCOME, { mention })

        await telegram.sendMessage(`@${group}`, welcomeMsg, SEND_OPTIONS)
      }
    }

    return reply(msg, SEND_OPTIONS)
  } catch (error) {
    throw error
  }
}

module.exports = textHandler
