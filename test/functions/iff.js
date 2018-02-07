const test = require('ava')
const { startWith, iff } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')
const R = require('ramda')

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

test('iff uses a default empty object', t => {
  const result = iff(true, R.merge({ name: 'John' }))()
  t.deepEqual(result, { name: 'John' })
})

test('iff else uses a default empty object', t => {
  const result = iff(false, R.merge({ name: 'John' }), R.merge({ name: 'Mary' }))()
  t.deepEqual(result, { name: 'Mary' })
})

test('iff no function uses a default empty object', t => {
  const result = iff(false, null, null)()
  t.deepEqual(result, {})
})
