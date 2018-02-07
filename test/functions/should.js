const test = require('ava')
const { startWith, should, ContextError } = require('../../index')

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

test('throws if predicates falsy, no error message', t => {
  return startWith()
    .then(should(() => false))
    .then(() => {
      t.fail()
    })
    .catch(() => {
      t.pass()
    })
})

test('should uses a default empty object', t => {
  const result = should(true, 'Fail')()
  t.deepEqual(result, {})
})

test('should uses a default empty object on predicate false', t => {
  const error = t.throws(() => {
    should(false, 'Fail')()
  }, ContextError)

  t.is(error.message, 'Fail')
  t.deepEqual(error.context, {})
})
