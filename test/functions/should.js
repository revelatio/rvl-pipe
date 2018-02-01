const test = require('ava')
const { startWith, should } = require('../../index')

test('doesnt throw if predicates truthy', t => {
  return startWith()
    .then(should(() => true, 'ShouldNotFail'))
    .then(() => {
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test('throws if predicates falsy', t => {
  return startWith()
    .then(should(() => false, 'ShouldFail'))
    .then(() => {
      t.fail()
    })
    .catch(() => {
      t.pass()
    })
})
