const R = require('ramda')
const Promise = require('bluebird')
const { passData } = require('./queries')
const { ContextError } = require('./error')

module.exports.set = prop => prev => R.merge(prev, passData(prop, prev))

module.exports.iff = (condition, fn, elseFn) => prev => {
  const value = passData(condition, prev)

  if (value) {
    return fn(prev)
  }

  if (elseFn) {
    return elseFn(prev)
  }

  return prev
}

module.exports.all = (...tasks) => prev => Promise.all(tasks.map(task => task(prev))).then(R.mergeAll)

module.exports.each = (...tasks) => prev => tasks.reduce((result, task) => result.then(task), Promise.resolve(prev))

module.exports.should = (predicate, errorCode) => prev => {
  const passes = passData(predicate, prev)

  if (!passes) {
    throw new ContextError(errorCode, prev)
  }

  return prev
}

module.exports.noop = () => prev => prev
