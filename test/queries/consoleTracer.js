const test = require('ava')
const { consoleTracer, startWith, set } = require('../../index')

let originalLog

test.before('faking console.log', t => {
  originalLog = console.log
  console.log = str => {
    t.is(str, 'name = "John"')
  }
})

test('should log using console tracer', t => {
  return startWith()
    .then(set({ name: 'John' }))
    .then(consoleTracer('name'))
    .then(() => {
      t.pass()
    })
})

test.after('restoring console.log', t => {
  console.log = originalLog
  t.pass()
})
