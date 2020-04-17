const { telegram } = require('../../qbot')
const { GROUPS } = require(`../configs/bot.json`)

const {
  MSG_ANSWER_SUCCESS,
  MSG_ANSWER_FAILURE
} = require('../configs/msgs.json')

class Concierge {
  static getQuestion (group) {
    return GROUPS[group].question
  }

  static validate (memberId, str) {
    const str_ = str.trim().toLowerCase()
    const groups = Object.keys(GROUPS)

    return Promise.all(
      groups.map(group => {
        const { answer } = GROUPS[group]

        return (Array.isArray(answer) ? answer.includes(str_) : answer === str_) &&
          (telegram.getChatMember(`@${group}`, memberId))
      })
    )
      .then((results) => {
        const success = results.some(res => (Boolean(res)))

        return {
          success,
          msg: success ? MSG_ANSWER_SUCCESS : MSG_ANSWER_FAILURE
        }
      })
  }
}

module.exports = Concierge
