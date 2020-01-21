import { composer, props } from '../../src'
import { delayedAsync } from '../helpers/delayed-async'

test('Merge several object', () => {
  const ctx = { name: 'John' }
  return composer(
    props({
      name: 'John'
    })
  )(ctx).then(result => {
    expect(result).toEqual({ name: 'John' })
  })
})

test('Merge several object with promised objects', () => {
  const ctx = { name: 'John' }
  return composer(
    props({
      name: 'John'
    }),
    delayedAsync(100, { last: 'Doe' })
  )(ctx).then(result => {
    expect(result).toEqual({ name: 'John', last: 'Doe' })
  })
})
