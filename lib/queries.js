const R = require('ramda')
const Promise = require('bluebird')

function isObject (value) {
  return value !== null && typeof value === 'object' && Array.isArray(value) === false && !(value instanceof Date)
}

module.exports.passData = (fnOrObj, data) => (typeof fnOrObj === 'function' ? fnOrObj(data) : fnOrObj)

module.exports.props = obj => ctx => {
  function process (ob) {
    return Object.keys(ob).reduce((result, key) => {
      const processedValue = module.exports.passData(ob[key], ctx)
      if (isObject(processedValue)) {
        return Object.assign(result, {[key]: process(processedValue)})
      }

      return Object.assign(result, {[key]: processedValue})
    }, {})
  }

  return process(obj)
}

module.exports.prop = path => R.view(R.lensPath(path.split('.')))

module.exports.equals = (sourceA, sourceB) => ctx => {
  const valueA = module.exports.passData(sourceA, ctx)
  const valueB = module.exports.passData(sourceB, ctx)

  return valueA === valueB
}

module.exports.not = predicate => ctx => !module.exports.passData(predicate, ctx)

module.exports.every = (...conditions) => ctx => conditions.every(
  condition => !!module.exports.passData(condition, ctx)
)

module.exports.some = (...conditions) => ctx => conditions.some(
  condition => !!module.exports.passData(condition, ctx)
)

module.exports.createTracer = tracer => path => ctx => {
  const value = module.exports.prop(path)(ctx)
  return Promise.resolve(tracer(path, value))
    .then(() => ctx)
}

module.exports.consoleTracer = (path, value) => {
  console.log(`${path} = ${JSON.stringify(value)}`)
  return Promise.resolve(true)
}
