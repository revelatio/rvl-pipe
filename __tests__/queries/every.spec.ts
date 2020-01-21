import { each, iff, every, always } from '../../src'
import { delayedAsync } from '../helpers/delayed-async'

test('should evaluate true if all elements truthy for static values', () => {
  return each(
    iff(
      every(always(true), always(1), always('John')),
      delayedAsync(100, { last: 'Doe' })
    )
  )().then(context => {
    expect(context).toEqual({ last: 'Doe' })
  })
})

test('should evaluate true if all elements truthy for dynamic values', () => {
  return each(
    iff(
      every(
        ctx => ctx.name,
        ctx => ctx.shouldPass
      ),
      delayedAsync(100, { last: 'Doe' })
    )
  )({ name: 'John', shouldPass: true }).then(context => {
    expect(context).toEqual({ name: 'John', last: 'Doe', shouldPass: true })
  })
})

test('every uses a default empty object', () => {
  const result = every(
    __ => true,
    __ => true
  )({})
  expect(result).toBe(true)
})
