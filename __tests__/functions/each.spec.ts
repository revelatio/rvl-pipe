import { each, capture, set, noop, ensure, always } from '../../src'
import { delayedAsync, delayedFail } from '../helpers/delayed-async'

test('runs all tasks serially', () => {
  const started = Date.now()

  return each(delayedAsync(500, { name: 'John' }), delayedAsync(500, { last: 'Doe' }))().then(
    context => {
      expect(context).toEqual({ name: 'John', last: 'Doe' })
      const duration = Date.now() - started
      expect(duration > 1000).toBe(true)
      expect(duration < 1200).toBe(true)
    }
  )
})

test('starting with each good for reusable steps', () => {
  const step = each(delayedAsync(100, { name: 'John' }), delayedAsync(100, { last: 'Doe' }))

  expect(step).not.toBeFalsy()

  return step().then(ctx => {
    expect(ctx).toEqual({ name: 'John', last: 'Doe' })
  })
})

test('async step fails, context remains untouched', done => {
  return each(
    delayedAsync(100, { name: 'John' }),
    delayedFail(100, 'CustomError'),
    delayedAsync(100, { last: 'Doe' })
  )()
    .then(() => {
      done.fail()
    })
    .catch(error => {
      expect(error.message).toBe('CustomError')
      done()
    })
})

test('async step fails, recovers from error', async () => {
  const context = await each(
    delayedAsync(100, { name: 'John' }),
    capture(delayedFail(100, 'CustomError'), set(always({ error: 'FailedAsync' }))),
    delayedAsync(100, { last: 'Doe' })
  )()

  expect(context).toEqual({
    name: 'John',
    last: 'Doe',
    error: 'FailedAsync'
  })
})

test('async step fails, recovers from different error types', done => {
  return each(
    delayedAsync(100, { name: 'John' }),
    capture(delayedFail(100, 'CustomError'), {
      AnotherCustomError: set(always({ error: 'FailedAsyncWithAnotherCustomError' })),
      CustomError: set(always({ error: 'FailedAsyncWithCustomError' }))
    }),
    delayedAsync(100, { last: 'Doe' })
  )()
    .then(context => {
      expect(context).toEqual({
        name: 'John',
        last: 'Doe',
        error: 'FailedAsyncWithCustomError'
      })
      done()
    })
    .catch(() => {
      done.fail()
    })
})

test('async step fails, no error type handler defined', done => {
  return each(
    delayedAsync(100, { name: 'John' }),
    capture(delayedFail(100, 'UnexpectedError'), {
      ExpectedError: noop()
    }),
    delayedAsync(100, { last: 'Doe' })
  )()
    .then(() => {
      done.fail()
    })
    .catch(error => {
      expect(error.message).toBe('UnexpectedError')
      done()
    })
})

test('async step fails, always run last step', done => {
  return ensure(
    each(
      delayedAsync(100, { name: 'John' }),
      delayedFail(100, 'CustomError'),
      delayedAsync(100, { last: 'Doe' })
    ),
    set(always({ didRecover: true }))
  )()
    .then(context => {
      expect(context).toEqual({
        didRecover: true
      })
      done()
    })
    .catch(error => {
      done.fail(error.message)
    })
})

test('async step does not fails, always run last step', done => {
  return ensure(
    each(delayedAsync(100, { name: 'John' }), delayedAsync(100, { last: 'Doe' })),
    set(always({ didRecover: true }))
  )()
    .then(context => {
      expect(context).toEqual({
        name: 'John',
        last: 'Doe',
        didRecover: true
      })
      done()
    })
    .catch(() => {
      done.fail()
    })
})
