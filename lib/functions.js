const R = require('ramda')
const Promise = require('bluebird')
const { passData } = require('./queries')
const { ContextError } = require('./error')

module.exports.set = prop => ctx => R.merge(ctx, passData(prop, ctx))

module.exports.iff = (condition, fn, elseFn) => ctx => {
  const value = passData(condition, ctx)

  if (value) {
    return fn(ctx)
  }

  if (elseFn) {
    return elseFn(ctx)
  }

  return ctx
}

module.exports.all = (...tasks) => ctx => Promise.all(tasks.map(task => task(ctx))).then(R.mergeAll)

module.exports.each = (...tasks) => ctx => tasks.reduce((result, task) => result.then(task), Promise.resolve(ctx || {}))

module.exports.should = (predicate, errorCode) => ctx => {
  const passes = passData(predicate, ctx)

  if (!passes) {
    throw new ContextError(errorCode, ctx)
  }

  return ctx
}

module.exports.noop = () => ctx => ctx
