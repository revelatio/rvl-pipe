const test = require('ava')
const { startWith, iff, some } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('should evaluate true if any element is truthy for static values', t => {
  return startWith()
    .then(iff(
      some(false, 0, 'John'),
      delayedAsync(100, { last: 'Doe' })
    ))
    .then(context => {
      t.deepEqual(context, { last: 'Doe' })
    })
})

test('should evaluate true if any element is truthy for dynamic values', t => {
  return startWith({ name: 'John', shouldPass: false })
    .then(iff(
      some(ctx => ctx.shouldPass, 10),
      delayedAsync(100, { last: 'Doe' })
    ))
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe', shouldPass: false })
    })
})
