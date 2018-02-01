const test = require('ava')
const { startWith, set } = require('../../index')

test('sets a static value in the context', t => {
  return startWith()
    .then(set({ name: 'John' }))
    .then(context => {
      t.deepEqual(context, { name: 'John' })
    })
})

test('sets a dynamic value in the context', t => {
  return startWith({ name: 'John' })
    .then(set(prev => ({ welcome: `Welcome ${prev.name}` })))
    .then(context => {
      t.deepEqual(context, { name: 'John', welcome: 'Welcome John' })
    })
})
