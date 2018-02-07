const test = require('ava')
const { createTracer, startWith, set } = require('../../index')

test('should log using custom tracer', t => {
  const customTracer = createTracer((path, value) => {
    t.is(path, 'name')
    t.is(value, 'John')
  })

  return startWith()
    .then(set({ name: 'John' }))
    .then(customTracer('name'))
})

test('createTracer uses a default empty object', t => {
  const customTracer = createTracer((path, value) => {
    t.is(path, 'someProp')
    t.is(value, undefined)
  })

  const result = customTracer('someProp')()
    .then(ctx => {
      t.deepEqual(ctx, {})
    })
})
