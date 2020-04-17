const { telegram } = require('../../qbot')
const { GROUPS } = require('../configs/bot.json')

const findChatsMember = (memberId) => {
  const groups = Object.keys(GROUPS)

  return Promise.all(
    groups.map(async (group) => {
      try {
        const data = await telegram.getChatMember(`@${group}`, memberId)

        return Object.assign({ group }, data)
      } catch (err) {
        return false
      }
    })
  )
    .then(results => (results.find(r => (r !== false && r))))
}

module.exports = findChatsMember
