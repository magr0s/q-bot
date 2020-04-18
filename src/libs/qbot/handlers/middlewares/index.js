const { Composer } = require('telegraf')

const anonymous = require('./anonymous')
const start = require('./start')

const composer = new Composer()

composer.on('message', anonymous)
composer.start(start)

module.exports = composer
