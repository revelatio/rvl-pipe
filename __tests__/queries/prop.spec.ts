import { prop } from '../../src'

test('should evaluate prop from context', () => {
  const ctx = { name: 'John' }
  const result = prop('name')(ctx)

  expect(result).toBe('John')
})

test('should evaluate nested prop from context', () => {
  const ctx = { user: { name: 'John' } }
  const result = prop('user.name')(ctx)

  expect(result).toBe('John')
})

test('should evaluate nested prop from context including array index', () => {
  const ctx = {
    user: {
      name: 'John',
      groups: [{ name: 'SevenDots' }, { name: 'Rucka' }]
    }
  }
  const result = prop('user.groups.0.name')(ctx)
  expect(result).toBe('SevenDots')
})

test('should return undefined if object does not have path', () => {
  const ctx = {
    user: {
      name: 'John',
      groups: [{ name: 'SevenDots' }, { name: 'Rucka' }]
    }
  }
  const result = prop('user.subject')(ctx)
  expect(result).toBeUndefined()
})

test('should return falsy value', () => {
  const ctx = {
    user: {
      name: 'John',
      isAdmin: false,
      projects: 0
    }
  }
  expect(prop('user.isAdmin')(ctx)).toBe(false)
  expect(prop('user.projects')(ctx)).toBe(0)
})
