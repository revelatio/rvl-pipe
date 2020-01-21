import { each, iff, some, always } from '../../src'
import { delayedAsync } from '../helpers/delayed-async'

test('should evaluate true if any element is truthy for static values', () => {
  return each(
    iff(
      some(always(false), always(0), always('John')),
      delayedAsync(100, { last: 'Doe' })
    )
  )().then(context => {
    expect(context).toEqual({ last: 'Doe' })
  })
})

test('should evaluate true if any element is truthy for dynamic values', () => {
  return each(
    iff(
      some(ctx => ctx.shouldPass, always(10)),
      delayedAsync(100, { last: 'Doe' })
    )
  )({ name: 'John', shouldPass: false }).then(context => {
    expect(context).toEqual({ name: 'John', last: 'Doe', shouldPass: false })
  })
})

test('some uses a default empty object', () => {
  const result = some(
    () => false,
    () => true
  )({})
  expect(result).toBe(true)
})
