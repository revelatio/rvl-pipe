const test = require('ava')
const { always, each, assign } = require('../../index')

test('assigns from sync function', t => {
  return each(
    assign('name', always('Joe'))
  )()
    .then(context => {
      t.deepEqual(context, { name: 'Joe' })
    })
})
