const test = require('ava')
const { startWith, each } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('runs all tasks in serie', t => {
  const started = Date.now()

  return startWith()
    .then(each(
      delayedAsync(500, { name: 'John' }),
      delayedAsync(500, { last: 'Doe' })
    ))
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe' })
      const duration = Date.now() - started
      t.true(duration > 1000)
      t.true(duration < 1200)
    })
})
