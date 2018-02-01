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
