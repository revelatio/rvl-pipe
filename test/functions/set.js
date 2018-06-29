const test = require('ava')
const { set, always } = require('../../index')

test('sets a static value in the context using always function', t => {
  return set(always({ name: 'John' }))()
    .then(context => {
      t.deepEqual(context, { name: 'John' })
    })
})

test('sets a dynamic value in the context', t => {
  return set(prev => ({ welcome: `Welcome ${prev.name}` }))({ name: 'John' })
    .then(context => {
      t.deepEqual(context, { name: 'John', welcome: 'Welcome John' })
    })
})

test('set uses a default empty object', t => {
  return set(always({ name: 'John' }))()
    .then(context => {
      t.deepEqual(context, { name: 'John' })
    })
})
