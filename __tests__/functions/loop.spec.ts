import { loop, each, Context } from '../../src'

test('simple loop', () => {
  const indexLT10 = (ctx: Context) => !!ctx && ctx.index < 10

  return loop(
    indexLT10,
    each((ctx: Context) => Promise.resolve({ ...ctx, index: ctx.index + 1 }))
  )({ index: 0 }).then(context => {
    expect(context).toEqual({ index: 10 })
  })
})
