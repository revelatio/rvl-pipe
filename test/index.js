const test = require('ava')
const { startWith } = require('../index')

test('startWith - Initialize context', t => {
  return startWith({ prop: 'value' })
    .then(context => {
      t.deepEqual(context, { prop: 'value' })
    })
})

test('startWith - Initialize context empty', t => {
  return startWith()
    .then(context => {
      t.deepEqual(context, {})
    })
})
