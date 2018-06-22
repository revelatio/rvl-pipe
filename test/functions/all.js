const test = require('ava')
const { all, set } = require('../../index')
const { delayedAsync, delayedFail } = require('../helpers/delayed-async')

test('runs all tasks in parallel', t => {
  const started = Date.now()

  return all(
    delayedAsync(1000, { name: 'John' }),
    delayedAsync(900, { last: 'Doe' })
  )()
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe' })
      const duration = Date.now() - started
      t.true(duration > 1000)
      t.true(duration < 1200)
    })
})

test('all uses a default empty object', t => {
  return all(
    set({ name: 'John' }),
    set({ last: 'Doe' })
  )()
    .then(ctx => {
      t.deepEqual(ctx, { name: 'John', last: 'Doe' })
    })
})

test('async step fails, context remains untouched', t => {
  return all(
    delayedAsync(100, { name: 'John' }),
    delayedFail(100, 'CustomError'),
    delayedAsync(100, { last: 'Doe' })
  )()
    .then(context => {
      t.fail()
    })
    .catch(error => {
      t.is(error.message, 'CustomError')
      t.deepEqual(error.context, {})
    })
})
