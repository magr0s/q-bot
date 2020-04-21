const { Composer } = require('telegraf')

const textHandler = require('./text')
const newChatMemberHandler = require('./newChatMember')

const composer = new Composer()

composer.on('new_chat_members', newChatMemberHandler)
composer.on('text', textHandler)

module.exports = composer
