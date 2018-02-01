const test = require('ava')
const { startWith, all } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

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
