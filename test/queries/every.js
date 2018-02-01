const test = require('ava')
const { startWith, iff, every } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('should evaluate true if all elements truthy for static values', t => {
  return startWith()
    .then(iff(
      every(true, 1, 'John'),
      delayedAsync(100, { last: 'Doe' })
    ))
    .then(context => {
      t.deepEqual(context, { last: 'Doe' })
    })
})

test('should evaluate true if all elements truthy for dynamic values', t => {
  return startWith({ name: 'John', shouldPass: true })
    .then(iff(
      every(ctx => ctx.name, ctx => ctx.shouldPass),
      delayedAsync(100, { last: 'Doe' })
    ))
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe', shouldPass: true })
    })
})