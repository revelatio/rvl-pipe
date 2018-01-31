const R = require('ramda')
const Promise = require('bluebird')

function ContextError (message, context) {
  this.name = 'ContextError'
  this.message = message || ''
  this.context = context
}
ContextError.prototype = Error.prototype

function isObject (value) {
  return value !== null && typeof value === 'object' && Array.isArray(value) === false && !(value instanceof Date)
}

module.exports.passData = (fnOrObj, data) => (typeof fnOrObj === 'function' ? fnOrObj(data) : fnOrObj)

module.exports.transform = (what, how) => prev => {
  const where = R.lensPath(what)
  const value = R.view(where, prev)

  return Promise.resolve(how(value)).then(newValue => R.set(where, newValue, prev))
}

module.exports.set = prop => prev => R.merge(prev, module.exports.passData(prop, prev))

const genericIf = (value, fn, elseFn) => prev => {
  if (value) {
    return fn(prev)
  }

  if (elseFn) {
    return elseFn(prev)
  }

  return prev
}

module.exports.iff = (condition, fn, elseFn) => prev => {
  const value = module.exports.passData(condition, prev)
  return genericIf(value, fn, elseFn)(prev)
}

module.exports.iffNot = (condition, fn, elseFn) => prev => {
  const value = module.exports.passData(condition, prev)
  return genericIf(!value, fn, elseFn)(prev)
}

module.exports.all = (...tasks) => prev => Promise.all(tasks.map(task => task(prev))).then(R.mergeAll)

module.exports.each = (...tasks) => prev => tasks.reduce((result, task) => result.then(task), Promise.resolve(prev))

module.exports.shouldHave = (props, errorCode) => prev => {
  const passes = R.compose(R.all(R.identity), R.props(props))(prev)

  if (!passes) {
    throw new ContextError(errorCode || `PropsNotFound: ${props.join(', ')}`, prev)
  }

  return prev
}

module.exports.doNothing = R.always

module.exports.throwContextError = prev => err => {
  throw new ContextError(err.message, prev)
}

module.exports.returnProp = prop => prev => R.view(R.lensPath(module.exports.passData(prop, prev)), prev)

module.exports.props = obj => prev => {
  function process (ob) {
    return Object.keys(ob).reduce((result, key) => {
      const processedValue = module.exports.passData(ob[key], prev)
      if (isObject(processedValue)) {
        return Object.assign(result, {[key]: process(processedValue)})
      }

      return Object.assign(result, {[key]: processedValue})
    }, {})
  }

  return process(obj)
}

module.exports.prop = path => R.view(R.lensPath(path.split('.')))
module.exports.propEq = (path, value) => R.compose(
  R.equals(value),
  R.view(R.lensPath(path.split('.')))
)
module.exports.not = R.compose(R.not, R.always)

module.exports.every = (...conditions) => prev => conditions.every(
  condition => !!module.exports.passData(condition, prev)
)

module.exports.some = (...conditions) => prev => conditions.some(
  condition => !!module.exports.passData(condition, prev)
)
