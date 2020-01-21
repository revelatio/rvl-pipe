import { iff, set, always } from '../../src'
import { delayedAsync } from '../helpers/delayed-async'

test('should run task if predicate truthy', () => {
  return iff(() => true, delayedAsync(400, { name: 'John' }))().then(
    context => {
      expect(context).toEqual({ name: 'John' })
    }
  )
})

test('should not run task if predicate falsy', () => {
  return iff(() => false, delayedAsync(400, { name: 'John' }))().then(
    context => {
      expect(context).toEqual({})
    }
  )
})

test('should run else task if predicate falsy', () => {
  return iff(
    () => false,
    delayedAsync(400, { name: 'John' }),
    delayedAsync(400, { name: 'Mary' })
  )().then(context => {
    expect(context).toEqual({ name: 'Mary' })
  })
})

test('iff uses a default empty object', () => {
  return iff(always(true), set(always({ name: 'John' })))().then(context => {
    expect(context).toEqual({ name: 'John' })
  })
})

test('iff else uses a default empty object', () => {
  return iff(
    always(false),
    set(always({ name: 'John' })),
    set(always({ name: 'Mary' }))
  )().then(context => {
    expect(context).toEqual({ name: 'Mary' })
  })
})
