const { telegram } = require('..')
const { GROUPS } = require('../configs/bot.json')

const getChatsMember = async (memberId) => {
  const results = await Promise.all(
    GROUPS.map((group) => {
      return telegram.getChatMember(`@${group}`, memberId)
        .then(data => (
          Object.assign({ group }, data)
        ))
        .catch(error => (false))
    })
  )

  return results.find(result => (result !== false && result))
}

module.exports = getChatsMember
