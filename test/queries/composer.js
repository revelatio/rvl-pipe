const test = require('ava')
const { composer, props } = require('../../index')
const { delayedAsync } = require('../helpers/delayed-async')

test('Merge several object', t => {
  const ctx = { name: 'John' }
  return composer(
    props({
      name: 'John'
    })
  )(ctx)
    .then(result => {
      t.deepEqual(result, { name: 'John' })
    })
})

test('Merge several object with promised objects', t => {
  const ctx = { name: 'John' }
  return composer(
    props({
      name: 'John'
    }),
    delayedAsync(100, { last: 'Doe' })
  )(ctx)
    .then(result => {
      t.deepEqual(result, { name: 'John', last: 'Doe' })
    })
})
