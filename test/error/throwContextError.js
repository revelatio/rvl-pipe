const test = require('ava')
const { startWith, throwContextError, equals, prop, should } = require('../../index')
const { delayedFail } = require('../helpers/delayed-async')

const myFailingAsyncTask = () => context => {
  return startWith(context)
    .then(delayedFail(100, 'SomethingFailed'))
    .catch(throwContextError(context))
}

const myFailingAsyncTaskWithNullContext = () => context => {
  return startWith(context)
    .then(delayedFail(100, 'SomethingFailed'))
    .catch(throwContextError())
}

test('should wrap error and add context', t => {
  return startWith({ name: 'John', last: 'Doe' })
    .then(myFailingAsyncTask())
    .catch(err => {
      t.is(err.message, 'SomethingFailed')
      t.deepEqual(err.context, { name: 'John', last: 'Doe' })
    })
})

test('should wrap error and add empty object if context null', t => {
  return startWith()
    .then(myFailingAsyncTaskWithNullContext())
    .catch(err => {
      t.is(err.message, 'SomethingFailed')
      t.deepEqual(err.context, {})
    })
})

test('should be able to recover from error', t => {
  return startWith({ name: 'John', last: 'Doe' })
    .then(myFailingAsyncTask())
    .catch(err => {
      t.is(err.message, 'SomethingFailed')
      t.deepEqual(err.context, { name: 'John', last: 'Doe' })

      return err.context
    })
    .then(should(equals(prop('name'), 'John'), 'FailedTest'))
})
