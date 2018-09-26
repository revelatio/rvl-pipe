const { should, all, each, iff, noop, set, loop, assign } = require('./lib/functions')
const { equals, always, every, prop, props, some, consoleTracer, createTracer, composer } = require('./lib/queries')
const { ContextError, capture, ensure } = require('./lib/error')

module.exports = {
  should,
  all,
  each,
  iff,
  noop,
  set,
  loop,
  assign,

  equals,
  always,
  every,
  prop,
  props,
  some,
  consoleTracer,
  createTracer,
  composer,

  ContextError,
  capture,
  ensure
}
