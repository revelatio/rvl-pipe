const test = require('ava')
const { startWith, all } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')
const R = require('ramda')

test('runs all tasks in parallel', t => {
  const started = Date.now()

  return startWith()
    .then(all(
      delayedAsync(1000, { name: 'John' }),
      delayedAsync(900, { last: 'Doe' })
    ))
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe' })
      const duration = Date.now() - started
      t.true(duration > 1000)
      t.true(duration < 1200)
    })
})

test('all uses a default empty object', t => {
  return all(R.merge({ name: 'John' }), R.merge({ last: 'Doe' }))()
    .then(ctx => {
      t.deepEqual(ctx, { name: 'John', last: 'Doe' })
    })
})
