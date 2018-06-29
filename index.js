const { should, all, each, iff, noop, set } = require('./lib/functions')
const { equals, always, every, prop, props, some, consoleTracer, createTracer } = require('./lib/queries')
const { ContextError, capture, ensure } = require('./lib/error')

module.exports = {
  should,
  all,
  each,
  iff,
  noop,
  set,

  equals,
  always,
  every,
  prop,
  props,
  some,
  consoleTracer,
  createTracer,

  ContextError,
  capture,
  ensure
}
