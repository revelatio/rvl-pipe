const R = require('ramda')
const Promise = require('bluebird')

function isObject (value) {
  return value !== null && typeof value === 'object' && Array.isArray(value) === false && !(value instanceof Date)
}

module.exports.passData = (fnOrObj, data) => (typeof fnOrObj === 'function' ? fnOrObj(data) : fnOrObj)

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

module.exports.equals = (sourceA, sourceB) => prev => {
  const valueA = module.exports.passData(sourceA, prev)
  const valueB = module.exports.passData(sourceB, prev)

  return valueA === valueB
}

module.exports.not = R.compose(R.not, R.always)

module.exports.every = (...conditions) => prev => conditions.every(
  condition => !!module.exports.passData(condition, prev)
)

module.exports.some = (...conditions) => prev => conditions.some(
  condition => !!module.exports.passData(condition, prev)
)

module.exports.createTracer = tracer => path => prev => {
  const value = module.exports.prop(path)(prev)
  return tracer(path, value)
    .then(() => prev)
}

module.exports.consoleTracer = (path, value) => {
  console.log(`${path} = ${JSON.stringify(value)}`)
  return Promise.resolve(true)
}
