const test = require('ava')
const { each, iff, equals, always } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('should evaluate true for static values', t => {
  const name = 'John'

  return each(
    iff(
      equals(always(name), always('John')),
      delayedAsync(100, { last: 'Doe' })
    )
  )()
    .then(context => {
      t.deepEqual(context, { last: 'Doe' })
    })
})

test('should evaluate true for dynamic values', t => {
  return each(
    iff(
      equals(context => context.name, always('John')),
      delayedAsync(100, { last: 'Doe' })
    )
  )({ name: 'John' })
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe' })
    })
})

test('should evaluate true for both dynamic values', t => {
  return each(
    iff(
      equals(ctx => ctx.name.toLowerCase(), ctx => ctx.otherName.toLowerCase()),
      delayedAsync(100, { last: 'Doe' })
    )
  )({ name: 'John', otherName: 'john' })
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe', otherName: 'john' })
    })
})

test('equals uses a default empty object', t => {
  const result = equals(() => 'A', () => 'A')()
  t.true(result)
})
