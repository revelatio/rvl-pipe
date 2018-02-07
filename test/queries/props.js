const test = require('ava')
const { props, prop } = require('../../index')

test('should evaluate object from context', t => {
  const ctx = { name: 'John' }
  const result = props({
    name: 'John'
  })(ctx)

  t.deepEqual(result, { name: 'John' })
})

test('should evaluate object from context passing dynamic props', t => {
  const ctx = { name: 'John' }
  const result = props({
    welcome: ctx => `Welcome ${ctx.name}`
  })(ctx)

  t.deepEqual(result, { welcome: 'Welcome John' })
})

test('should evaluate object from context passing dynamic props, using fn prop', t => {
  const ctx = { name: 'John', auth: { via: 'gh', token: '12873', group: 'seventh' } }
  const when = new Date()
  const result = props({
    username: prop('name'),
    token: prop('auth.token'),
    teams: ['Woah!', 'Klo'],
    when: when,
    nested: {
      group: prop('auth.group')
    }
  })(ctx)

  t.deepEqual(
    result,
    {
      username: 'John',
      token: '12873',
      teams: ['Woah!', 'Klo'],
      when: when,
      nested: {
        group: 'seventh'
      }
    }
  )
})

test('props uses a default empty object', t => {
  const result = props({ name: 'John' })()
  t.deepEqual(result, { name: 'John'})
})
