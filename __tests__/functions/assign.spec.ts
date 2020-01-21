import { always, each, assign } from '../../src'

test('assigns from sync function', () => {
  return each(assign('name', always('Joe')))().then(context => {
    expect(context).toEqual({ name: 'Joe' })
  })
})
