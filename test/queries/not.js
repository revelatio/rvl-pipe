const test = require('ava')
const { not } = require('../../index')

test('should evaluate falsy for static values', t => {
  const name = 'John'
  const ctx = {}
  const result = not(name)(ctx)

  t.falsy(result)
})

test('should evaluate truthy for static values', t => {
  const name = false
  const ctx = {}
  const result = not(name)(ctx)

  t.truthy(result)
})

test('should evaluate falsy for dynamic values', t => {
  const ctx = { name: 'John' }
  const result = not(ctx => ctx.name)(ctx)

  t.falsy(result)
})

test('should evaluate truthy for dynamic values', t => {
  const ctx = { name: 'John', shouldPass: false }
  const result = not(ctx => ctx.shouldPass)(ctx)

  t.truthy(result)
})
