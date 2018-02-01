const test = require('ava')
const { passData } = require('../../index')

test('should return static object', t => {
  const context = { otherProp: 'Some value' }
  const result = passData({ name: 'John', last: 'Doe' }, context)
  t.deepEqual(result, { name: 'John', last: 'Doe' })
})

test('should evaluate function for dynamic values', t => {
  const context = { otherProp: 'Some value' }
  const result = passData(ctx => ({ name: ctx.otherProp }), context)
  t.deepEqual(result, { name: 'Some value' })
})
