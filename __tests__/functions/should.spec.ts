import { should, always } from '../../src'

test('doesnt throw if predicates truthy', done => {
  return should(() => true, 'ShouldNotFail')()
    .then(() => {
      done()
    })
    .catch(() => {
      done.fail()
    })
})

test('throws if predicates falsy', done => {
  return should(() => false, 'ShouldFail')()
    .then(() => {
      done.fail()
    })
    .catch(() => {
      done()
    })
})

test('should uses a default empty object, using always', () => {
  return should(always(true), 'Fail')().then(context => {
    expect(context).toEqual({})
  })
})

test('should uses a default empty object on predicate false, using always', done => {
  return should(always(false), 'Fail')()
    .then(() => {
      done.fail()
    })
    .catch(() => {
      done()
    })
})

test('should pass error if specified', done => {
  return should(always(false), new Error('standard-error'))()
    .then(() => {
      done.fail()
    })
    .catch(error => {
      expect(error.message).toEqual('standard-error')
      done()
    })
})
