const test = require('ava')
const { prop } = require('../../index')

test('should evaluate prop from context', t => {
  const ctx = { name: 'John' }
  const result = prop('name')(ctx)

  t.is(result, 'John')
})

test('should evaluate nested prop from context', t => {
  const ctx = { user: { name: 'John' } }
  const result = prop('user.name')(ctx)

  t.is(result, 'John')
})

test('should evaluate nested prop from context including array index', t => {
  const ctx = {
    user: {
      name: 'John',
      groups: [
        { name: 'SevenDots' },
        { name: 'Rucka' }
      ]
    }
  }
  const result = prop('user.groups.0.name')(ctx)
  t.is(result, 'SevenDots')
})

test('should return undefined if object does not have path', t => {
  const ctx = {
    user: {
      name: 'John',
      groups: [
        { name: 'SevenDots' },
        { name: 'Rucka' }
      ]
    }
  }
  const result = prop('user.subject')(ctx)
  t.is(result, undefined)
})

test('should return falsy value', t => {
  const ctx = {
    user: {
      name: 'John',
      isAdmin: false,
      projects: 0
    }
  }
  t.is(prop('user.isAdmin')(ctx), false)
  t.is(prop('user.projects')(ctx), 0)
})

