function isObject (value) {
  return value !== null && typeof value === 'object' && Array.isArray(value) === false && !(value instanceof Date)
}

module.exports.always = data => () => data

module.exports.props = obj => ctx => {
  const passData = (fnOrObj, data) => (typeof fnOrObj === 'function' ? fnOrObj(data) : fnOrObj)

  function process (ob) {
    return Object
      .keys(ob)
      .reduce(
        (result, key) => {
          const processedValue = passData(ob[key], ctx || {})
          if (isObject(processedValue)) {
            return Object.assign(result, {[key]: process(processedValue)})
          }

          return Object.assign(result, {[key]: processedValue})
        },
        {}
      )
  }

  return process(obj)
}

module.exports.prop = path => ctx => {
  const paths = path.split('.')

  return paths.reduce(
    (prev, token) => (prev && token in prev && prev[token]) || undefined,
    ctx
  )
}

module.exports.equals = (sourceA, sourceB) => ctx => sourceA(ctx || {}) === sourceB(ctx || {})

module.exports.every = (...conditions) => ctx => conditions
  .every(condition => !!condition(ctx || {}))

module.exports.some = (...conditions) => ctx => conditions
  .some(condition => !!condition(ctx || {}))

module.exports.createTracer = tracer => path => ctx => {
  const value = module.exports.prop(path)(ctx || {})
  return Promise.resolve(tracer(path, value))
    .then(() => (ctx || {}))
}

module.exports.consoleTracer = module.exports.createTracer((path, value) => {
  console.log(`${path} = ${JSON.stringify(value)}`)
})
