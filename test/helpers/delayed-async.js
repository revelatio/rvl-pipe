const Promise = require('bluebird')

module.exports.delayedAsync = (delay, obj) => context => new Promise(resolve => setTimeout(() => {
  resolve(Object.assign(context, obj))
}, delay))
