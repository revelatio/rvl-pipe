const test = require('ava')
const { loop, each } = require('../../index')

test('simple loop', t => {
  return loop(
    ctx => ctx.index < 10,
    each(
      ctx => {
        ctx.index += 1
        return ctx
      }
    )
  )({ index: 0 })
    .then(context => {
      t.deepEqual(context, { index: 10 })
    })
})
