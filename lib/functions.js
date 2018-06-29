const { ContextError } = require('./error')

module.exports.set = prop => ctx => Promise.resolve(Object.assign({}, ctx || {}, prop(ctx || {})))

module.exports.iff = (condition, fn, elseFn) => ctx => {
  const value = condition(ctx || {})

  if (value) {
    return Promise.resolve(fn(ctx || {}))
  }

  if (elseFn) {
    return Promise.resolve(elseFn(ctx || {}))
  }

  return Promise.resolve(ctx || {})
}

module.exports.all = (...tasks) => ctx => Promise.all(
  tasks.map(task => task(ctx || {}))
)
  .then(contexts => Object.assign({}, ...contexts))
  .catch(error => Promise.reject(new ContextError(error.message, ctx || {})))

module.exports.each = (...tasks) => ctx => Promise.resolve(
  tasks.reduce(
    (result, task) => result.then(task),
    Promise.resolve(ctx || {})
  )
)
  .catch(error => Promise.reject(new ContextError(error.message, ctx || {})))

module.exports.should = (predicate, errorCode) => ctx => {
  const passes = predicate(ctx || {})

  if (!passes) {
    return Promise.reject(new ContextError(errorCode, ctx || {}))
  }

  return Promise.resolve(ctx || {})
}

module.exports.noop = () => ctx => Promise.resolve(ctx || {})
