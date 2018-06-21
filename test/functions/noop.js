const test = require('ava')
const { noop } = require('../../index')

test('performs no operation', t => {
  return noop()({ name: 'John', last: 'Doe' })
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe' })
    })
})

test('noop uses a default empty object', t => {
  return noop()()
    .then(context => {
      t.deepEqual(context, {})
    })
})
