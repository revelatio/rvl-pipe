const test = require('ava')
const { each } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('runs all tasks in serie', t => {
  const started = Date.now()

  return each(
    delayedAsync(500, { name: 'John' }),
    delayedAsync(500, { last: 'Doe' })
  )()
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe' })
      const duration = Date.now() - started
      t.true(duration > 1000)
      t.true(duration < 1200)
    })
})

test('starting with each good for reusable steps', t => {
  const step = each(
    delayedAsync(100, { name: 'John' }),
    delayedAsync(100, { last: 'Doe' })
  )

  t.truthy(step)

  return step()
    .then(ctx => {
      t.deepEqual(ctx, { name: 'John', last: 'Doe' })
    })
})
