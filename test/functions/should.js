const test = require('ava')
const { should, ContextError } = require('../../index')

test('doesnt throw if predicates truthy', t => {
  return should(() => true, 'ShouldNotFail')()
    .then(() => {
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test('throws if predicates falsy', t => {
  return should(() => false, 'ShouldFail')()
    .then(() => {
      t.fail()
    })
    .catch(() => {
      t.pass()
    })
})

test('throws if predicates falsy, no error message', t => {
  return should(() => false)()
    .then(() => {
      t.fail()
    })
    .catch(() => {
      t.pass()
    })
})

test('should uses a default empty object', t => {
  return should(true, 'Fail')()
    .then(context => {
      t.deepEqual(context, {})
    })
})

test('should uses a default empty object on predicate false', t => {
  return should(false, 'Fail')()
    .then(() => {
      t.fail()
    })
    .catch(() => {
      t.pass()
    })
})
