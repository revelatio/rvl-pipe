const test = require('ava')
const { startWith, iff } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('should run task if predicate truthy', t => {
  return startWith()
    .then(iff(
      () => true,
      delayedAsync(400, { name: 'John' })
    ))
    .then(context => {
      t.deepEqual(context, { name: 'John' })
    })
})

test('should not run task if predicate falsy', t => {
  return startWith()
    .then(iff(
      () => false,
      delayedAsync(400, { name: 'John' })
    ))
    .then(context => {
      t.deepEqual(context, {})
    })
})

test('should run else task if predicate falsy', t => {
  return startWith()
    .then(iff(
      () => false,
      delayedAsync(400, { name: 'John' }),
      delayedAsync(400, { name: 'Mary' })
    ))
    .then(context => {
      t.deepEqual(context, { name: 'Mary' })
    })
})
