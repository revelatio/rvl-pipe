const test = require('ava')
const { each, iff, every } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('should evaluate true if all elements truthy for static values', t => {
  return each(
    iff(
      every(true, 1, 'John'),
      delayedAsync(100, { last: 'Doe' })
    )
  )()
    .then(context => {
      t.deepEqual(context, { last: 'Doe' })
    })
})

test('should evaluate true if all elements truthy for dynamic values', t => {
  return each(
    iff(
      every(ctx => ctx.name, ctx => ctx.shouldPass),
      delayedAsync(100, { last: 'Doe' })
    )
  )({ name: 'John', shouldPass: true })
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe', shouldPass: true })
    })
})

test('every uses a default empty object', t => {
  const result = every(() => true, () => true)()
  t.true(result)
})
