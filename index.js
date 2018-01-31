const Promise = require('bluebird')
const {
  passData, transform, returnProp,
  set, iff, iffNot, all, each, shouldHave,
  throwContextError, doNothing, props, prop,
  every, some, propEq, not
} = require('./lib/functions')

module.exports.startWith = prev => Promise.resolve(prev)
module.exports.passData = passData
module.exports.transform = transform
module.exports.returnProp = returnProp
module.exports.set = set
module.exports.iff = iff
module.exports.iffNot = iffNot
module.exports.all = all
module.exports.each = each
module.exports.doNothing = doNothing
module.exports.shouldHave = shouldHave
module.exports.props = props
module.exports.prop = prop
module.exports.propEq = propEq
module.exports.not = not
module.exports.every = every
module.exports.some = some
module.exports.throwContextError = throwContextError
module.exports.createTracer = trace => path => prev => {
  const value = prop(path)(prev)
  trace(`${path} = ${JSON.stringify(value)}`)
  return prev
}
