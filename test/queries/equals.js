const test = require('ava')
const { startWith, iff, equals } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('should evaluate true for static values', t => {
  const name = 'John'

  return startWith()
    .then(iff(
      equals(name, 'John'),
      delayedAsync(100, { last: 'Doe' })
    ))
    .then(context => {
      t.deepEqual(context, { last: 'Doe' })
    })
})

test('should evaluate true for dynamic values', t => {
  return startWith({ name: 'John' })
    .then(iff(
      equals(context => context.name, 'John'),
      delayedAsync(100, { last: 'Doe' })
    ))
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe' })
    })
})

test('should evaluate true for both dynamic values', t => {
  return startWith({ name: 'John', otherName: 'john' })
    .then(iff(
      equals(ctx => ctx.name.toLowerCase(), ctx => ctx.otherName.toLowerCase()),
      delayedAsync(100, { last: 'Doe' })
    ))
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe', otherName: 'john' })
    })
})

test('equals uses a default empty object', t => {
  const result = equals(() => 'A', () => 'A')()
  t.true(result)
})
