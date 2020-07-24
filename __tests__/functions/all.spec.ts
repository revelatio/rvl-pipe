import { all, set, always } from '../../src'
import { delayedAsync, delayedFail } from '../helpers/delayed-async'

test('runs all tasks in parallel', () => {
  const started = Date.now()

  return all(delayedAsync(1000, { name: 'John' }), delayedAsync(900, { last: 'Doe' }))().then(
    (context: Object) => {
      expect(context).toEqual({ name: 'John', last: 'Doe' })
      const duration = Date.now() - started
      expect(duration > 1000).toBe(true)
      expect(duration < 1200).toBe(true)
    }
  )
})

test('all uses a default empty object', () => {
  return all(set(always({ name: 'John' })), set(always({ last: 'Doe' })))().then((ctx: Object) => {
    expect(ctx).toEqual({ name: 'John', last: 'Doe' })
  })
})

test('async step fails, context remains untouched', () => {
  return all(
    delayedAsync(100, { name: 'John' }),
    delayedFail(100, 'CustomError'),
    delayedAsync(100, { last: 'Doe' })
  )().catch((error: Error) => {
    expect(error.message).toBe('CustomError')
  })
})
