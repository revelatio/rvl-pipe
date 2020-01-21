import { capture, set, always } from '../../src'
import { delayedFail } from '../helpers/delayed-async'

test('async step fails, recovers from error', done => {
  return capture(
    delayedFail(100, 'CustomError'),
    set(always({ error: 'FailedAsync' }))
  )()
    .then(context => {
      expect(context).toEqual({
        error: 'FailedAsync'
      })
      done()
    })
    .catch(error => {
      done.fail(error.message)
    })
})
