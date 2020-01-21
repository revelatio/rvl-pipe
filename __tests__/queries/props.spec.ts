import { props, prop, Context } from '../../src'

test('should evaluate object from context', () => {
  const ctx = { name: 'John' }
  const result = props({
    name: 'John'
  })(ctx)

  expect(result).toEqual({ name: 'John' })
})

test('should evaluate object from context passing dynamic props', () => {
  const ctx = { name: 'John' }
  const result = props({
    welcome: (ctx: Context) => `Welcome ${ctx.name}`
  })(ctx)

  expect(result).toEqual({ welcome: 'Welcome John' })
})

test('should evaluate object from context passing dynamic props, using fn prop', () => {
  const ctx = {
    name: 'John',
    auth: { via: 'gh', token: '12873', group: 'seventh' }
  }
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

  expect(result).toEqual({
    username: 'John',
    token: '12873',
    teams: ['Woah!', 'Klo'],
    when: when,
    nested: {
      group: 'seventh'
    }
  })
})

test('should evaluate object with array', () => {
  const ctx = {
    name: 'John',
    auth: { via: 'gh', token: '12873', group: 'seventh' }
  }

  const result = props({
    credentialsArray: [
      prop('name'),
      prop('auth.via'),
      { token: prop('auth.token') },
      32
    ]
  })(ctx)

  expect(result).toEqual({
    credentialsArray: [
      'John',
      'gh',
      {
        token: '12873'
      },
      32
    ]
  })
})

test('props uses a default empty object', () => {
  const result = props({ name: 'John' })({})
  expect(result).toEqual({ name: 'John' })
})

test('props uses a default empty object on array', () => {
  const result = props({ name: ['John'] })({})
  expect(result).toEqual({ name: ['John'] })
})
