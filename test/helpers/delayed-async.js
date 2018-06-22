module.exports.delayedAsync = (delay, obj) => context => new Promise(resolve => setTimeout(() => {
  resolve(Object.assign(context, obj))
}, delay))

module.exports.delayedFail = (delay, error) => context => new Promise((resolve, reject) => setTimeout(() => {
  reject(new Error(error))
}, delay))
