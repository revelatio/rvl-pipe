import { each, iff, equals, always } from '../../src'
import { delayedAsync } from '../helpers/delayed-async'

test('should evaluate true for static values', () => {
  const name = 'John'

  return each(
    iff(
      equals(always(name), always('John')),
      delayedAsync(100, { last: 'Doe' })
    )
  )().then(context => {
    expect(context).toEqual({ last: 'Doe' })
  })
})

test('should evaluate true for dynamic values', () => {
  return each(
    iff(
      equals(context => context.name, always('John')),
      delayedAsync(100, { last: 'Doe' })
    )
  )({ name: 'John' }).then(context => {
    expect(context).toEqual({ name: 'John', last: 'Doe' })
  })
})

test('should evaluate true for both dynamic values', () => {
  return each(
    iff(
      equals(
        ctx => ctx.name.toLowerCase(),
        ctx => ctx.otherName.toLowerCase()
      ),
      delayedAsync(100, { last: 'Doe' })
    )
  )({ name: 'John', otherName: 'john' }).then(context => {
    expect(context).toEqual({ name: 'John', last: 'Doe', otherName: 'john' })
  })
})

test('equals uses a default empty object', () => {
  const result = equals(
    __ => 'A',
    __ => 'A'
  )({})
  expect(result).toBe(true)
})
