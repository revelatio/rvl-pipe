const { should, all, each, iff, noop, set, loop, assign } = require('./src/functions')
const { equals, always, every, prop, props, some, consoleTracer, createTracer, composer } = require('./src/queries')
const { ContextError, capture, ensure } = require('./src/error')

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
