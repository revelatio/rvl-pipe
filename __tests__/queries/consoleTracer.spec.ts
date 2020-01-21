import { consoleTracer, each, set, always } from '../../src'

let originalLog: typeof console.log

describe('consoleTracer', () => {
  beforeAll(() => {
    originalLog = console.log
    console.log = (str: string) => {
      expect(str).toBe('name = "John"')
    }
  })

  it('should log using console tracer', () => {
    return each(set(always({ name: 'John' })), consoleTracer('name'))().then(
      () => {}
    )
  })

  afterAll(() => {
    console.log = originalLog
  })
})
