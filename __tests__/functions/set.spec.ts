import { set, always } from '../../src'

test('sets a static value in the context using always function', () => {
  return set(always({ name: 'John' }))().then(context => {
    expect(context).toEqual({ name: 'John' })
  })
})

test('sets a dynamic value in the context', () => {
  return set(prev => ({ welcome: `Welcome ${prev.name}` }))({
    name: 'John'
  }).then(context => {
    expect(context).toEqual({ name: 'John', welcome: 'Welcome John' })
  })
})

test('set uses a default empty object', () => {
  return set(always({ name: 'John' }))().then(context => {
    expect(context).toEqual({ name: 'John' })
  })
})
