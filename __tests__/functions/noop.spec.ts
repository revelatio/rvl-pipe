import { noop } from '../../src'

test('performs no operation', () => {
  return noop()({ name: 'John', last: 'Doe' }).then(context => {
    expect(context).toEqual({ name: 'John', last: 'Doe' })
  })
})

test('noop uses a default empty object', () => {
  return noop()().then(context => {
    expect(context).toEqual({})
  })
})
