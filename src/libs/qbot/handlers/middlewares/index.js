const { Composer } = require('telegraf')

const anonymous = require('./anonymous')

const composer = new Composer()

composer.on('message', anonymous)

module.exports = composer
