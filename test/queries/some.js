const test = require('ava')
const { each, iff, some } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('should evaluate true if any element is truthy for static values', t => {
  return each(
    iff(
      some(false, 0, 'John'),
      delayedAsync(100, { last: 'Doe' })
    )
  )()
    .then(context => {
      t.deepEqual(context, { last: 'Doe' })
    })
})

test('should evaluate true if any element is truthy for dynamic values', t => {
  return each(
    iff(
      some(ctx => ctx.shouldPass, 10),
      delayedAsync(100, { last: 'Doe' })
    )
  )({ name: 'John', shouldPass: false })
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe', shouldPass: false })
    })
})

test('some uses a default empty object', t => {
  const result = some(() => false, () => true)()
  t.true(result)
})
