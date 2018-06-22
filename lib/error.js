function ContextError (message, context) {
  this.name = 'ContextError'
  this.message = message || ''
  this.context = context
}
ContextError.prototype = Error.prototype

module.exports.ContextError = ContextError

module.exports.capture = (step, handler) => ctx => {
  return step(ctx)
    .catch(error => {
      if (typeof (handler) === 'function') {
        return Promise.resolve(handler(ctx))
      }

      if (!(error.message in handler)) {
        return Promise.reject(error)
      }

      return Promise.resolve(handler[error.message](ctx))
    })
}

module.exports.ensure = (step, handler) => ctx => {
  return step(ctx)
    .catch(error => Promise.resolve(error.context))
    .then(handler)
}
