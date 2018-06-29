const test = require('ava')
const { consoleTracer, each, set, always } = require('../../index')

let originalLog

test.before('faking console.log', t => {
  originalLog = console.log
  console.log = str => {
    t.is(str, 'name = "John"')
  }
})

test('should log using console tracer', t => {
  return each(
    set(always({ name: 'John' })),
    consoleTracer('name')
  )()
    .then(() => {
      t.pass()
    })
})

test.after('restoring console.log', t => {
  console.log = originalLog
  t.pass()
})
