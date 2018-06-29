const test = require('ava')
const { iff, set, always } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('should run task if predicate truthy', t => {
  return iff(
    () => true,
    delayedAsync(400, { name: 'John' })
  )()
    .then(context => {
      t.deepEqual(context, { name: 'John' })
    })
})

test('should not run task if predicate falsy', t => {
  return iff(
    () => false,
    delayedAsync(400, { name: 'John' })
  )()
    .then(context => {
      t.deepEqual(context, {})
    })
})

test('should run else task if predicate falsy', t => {
  return iff(
    () => false,
    delayedAsync(400, { name: 'John' }),
    delayedAsync(400, { name: 'Mary' })
  )()
    .then(context => {
      t.deepEqual(context, { name: 'Mary' })
    })
})

test('iff uses a default empty object', t => {
  return iff(
    always(true),
    set(always({ name: 'John' }))
  )()
    .then(context => {
      t.deepEqual(context, { name: 'John' })
    })
})

test('iff else uses a default empty object', t => {
  return iff(
    always(false),
    set(always({ name: 'John' })),
    set(always({ name: 'Mary' }))
  )()
    .then(context => {
      t.deepEqual(context, { name: 'Mary' })
    })
})

test('iff no function uses a default empty object', t => {
  return iff(
    always(false),
    null,
    null
  )()
    .then(context => {
      t.deepEqual(context, {})
    })
})
