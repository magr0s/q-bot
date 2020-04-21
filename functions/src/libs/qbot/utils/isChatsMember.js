const { telegram } = require('..')
const { GROUPS } = require('../configs/bot.json')

const isChatsMember = (memberId) => {
  const groups = Object.keys(GROUPS)

  return Promise.all(
    groups.map((group) => {
      try {
        return telegram.getChatMember(`@${group}`, memberId)
      } catch (err) {
        return false
      }
    })
  )
    .then(results => (results.some(r => (r !== false))))
}

module.exports = isChatsMember
