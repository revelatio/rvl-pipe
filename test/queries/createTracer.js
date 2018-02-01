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