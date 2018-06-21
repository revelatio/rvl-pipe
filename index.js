const { should, all, each, iff, noop, set } = require('./lib/functions')
const { equals, passData, every, prop, props, some, consoleTracer, createTracer } = require('./lib/queries')
const { ContextError, throwContextError } = require('./lib/error')

module.exports = {
  should,
  all,
  each,
  iff,
  noop,
  set,

  equals,
  passData,
  every,
  prop,
  props,
  some,
  consoleTracer,
  createTracer,

  ContextError,
  throwContextError
}
