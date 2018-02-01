function ContextError (message, context) {
  this.name = 'ContextError'
  this.message = message || ''
  this.context = context
}
ContextError.prototype = Error.prototype

module.exports.ContextError = ContextError

module.exports.throwContextError = prev => err => {
  throw new ContextError(err.message, prev)
}
