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

class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}

test('should pass error if specified', done => {
  return should(always(false), new CustomError('standard-error'))()
    .then(() => {
      done.fail()
    })
    .catch(error => {
      expect(error.name).toEqual('CustomError')
      expect(error.message).toEqual('standard-error')
      done()
    })
})

test('should create error if string error', done => {
  return should(always(false), 'standard-error')()
    .then(() => {
      done.fail()
    })
    .catch(error => {
      expect(error.name).toEqual('Error')
      expect(error.message).toEqual('standard-error')
      done()
    })
})
