const Promise = require('bluebird')
const { should, all, each, iff, noop, set } = require('./lib/functions')
const { equals, passData, every, not, prop, props, some, consoleTracer, createTracer } = require('./lib/queries')
const { ContextError, throwContextError } = require('./lib/error')

module.exports = {
  startWith: prev => Promise.resolve(prev || {}),

  should,
  all,
  each,
  iff,
  noop,
  set,

  equals,
  passData,
  every,
  not,
  prop,
  props,
  some,
  consoleTracer,
  createTracer,

  ContextError,
  throwContextError
}
