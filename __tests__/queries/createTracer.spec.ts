import {
  createTracer,
  each,
  set,
  always,
  TracerFunction,
  AsyncFunction
} from '../../src'
import { TracerCreatorFunction } from '../../src/queries'

test('should log using custom tracer', () => {
  const tracer: TracerCreatorFunction = (path: string, value: any) => {
    expect(path).toBe('name')
    expect(value).toBe('John')
  }
  const customTracer: TracerFunction = createTracer(tracer)
  const nameTracer: AsyncFunction = customTracer('name')
  return each(set(always({ name: 'John' })), nameTracer)().then(() => {})
})

test('createTracer uses a default empty object', () => {
  const customTracer = createTracer((path, value) => {
    expect(path).toBe('someProp')
    expect(value).toBeUndefined()
  })

  return customTracer('someProp')().then(ctx => {
    expect(ctx).toEqual({})
  })
})
