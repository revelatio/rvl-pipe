function ContextError (message, context) {
  this.name = 'ContextError'
  this.message = message || ''
  this.context = context
}
ContextError.prototype = Error.prototype

module.exports.ContextError = ContextError
