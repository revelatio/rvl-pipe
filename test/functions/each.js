const test = require('ava')
const { each, capture, set, noop, ensure, always } = require('../../index')
const { delayedAsync, delayedFail } = require('../helpers/delayed-async')

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

test('async step fails, context remains untouched', t => {
  return each(
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

test('async step fails, recovers from error', t => {
  return each(
    delayedAsync(100, { name: 'John' }),
    capture(
      delayedFail(100, 'CustomError'),
      set(always({ error: 'FailedAsync' }))
    ),
    delayedAsync(100, { last: 'Doe' })
  )()
    .then(context => {
      t.deepEqual(
        context,
        {
          name: 'John',
          last: 'Doe',
          error: 'FailedAsync'
        }
      )
    })
    .catch(() => {
      t.fail()
    })
})

test('async step fails, recovers from different error types', t => {
  return each(
    delayedAsync(100, { name: 'John' }),
    capture(
      delayedFail(100, 'CustomError'),
      {
        'AnotherCustomError': set(always({ error: 'FailedAsyncWithAnotherCustomError' })),
        'CustomError': set(always({ error: 'FailedAsyncWithCustomError' }))
      }
    ),
    delayedAsync(100, { last: 'Doe' })
  )()
    .then(context => {
      t.deepEqual(
        context,
        {
          name: 'John',
          last: 'Doe',
          error: 'FailedAsyncWithCustomError'
        }
      )
    })
    .catch(() => {
      t.fail()
    })
})

test('async step fails, no error type handler defined', t => {
  return each(
    delayedAsync(100, { name: 'John' }),
    capture(
      delayedFail(100, 'UnexpectedError'),
      {
        'ExpectedError': noop()
      }
    ),
    delayedAsync(100, { last: 'Doe' })
  )()
    .then(context => {
      t.fail()
    })
    .catch(error => {
      t.is(error.message, 'UnexpectedError')
      t.deepEqual(error.context, {})
    })
})

test('async step fails, always run last step', t => {
  return ensure(
    each(
      delayedAsync(100, { name: 'John' }),
      delayedFail(100, 'CustomError'),
      delayedAsync(100, { last: 'Doe' })
    ),
    set(always({ didRecover: true }))
  )()
    .then(context => {
      t.deepEqual(
        context,
        {
          didRecover: true
        }
      )
    })
    .catch(() => {
      t.fail()
    })
})

test('async step does not fails, always run last step', t => {
  return ensure(
    each(
      delayedAsync(100, { name: 'John' }),
      delayedAsync(100, { last: 'Doe' })
    ),
    set(always({ didRecover: true }))
  )()
    .then(context => {
      t.deepEqual(
        context,
        {
          name: 'John',
          last: 'Doe',
          didRecover: true
        }
      )
    })
    .catch(() => {
      t.fail()
    })
})
