const test = require('ava')
const { startWith, noop } = require('../../index')

test('performs no operation', t => {
  return startWith({ name: 'John', last: 'Doe' })
    .then(noop())
    .then(context => {
      t.deepEqual(context, { name: 'John', last: 'Doe' })
    })
})

test('noop uses a default empty object', t => {
  const result = noop()()
  t.deepEqual(result, {})
})
