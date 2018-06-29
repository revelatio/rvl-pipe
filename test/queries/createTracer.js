const test = require('ava')
const { createTracer, each, set, always } = require('../../index')

test('should log using custom tracer', t => {
  const customTracer = createTracer((path, value) => {
    t.is(path, 'name')
    t.is(value, 'John')
  })

  return each(
    set(always({ name: 'John' })),
    customTracer('name')
  )()
})

test('createTracer uses a default empty object', t => {
  const customTracer = createTracer((path, value) => {
    t.is(path, 'someProp')
    t.is(value, undefined)
  })

  return customTracer('someProp')()
    .then(ctx => {
      t.deepEqual(ctx, {})
    })
})
