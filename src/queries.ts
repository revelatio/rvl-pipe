import { AsyncFunction, Context, SyncFunction, SyncPredicate } from './defs'

function isObject (value: any): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    !(value instanceof Date)
  )
}

export const always = (data: any): SyncFunction => () => data

export const props = (obj: Context): SyncFunction => (ctx: Context = {}) => {
  const passData = (fnOrObj: SyncFunction | {}, data: {}) =>
    typeof fnOrObj === 'function' ? fnOrObj(data) : fnOrObj

  function process (ob: {}): any {
    if (!isObject(ob)) {
      return passData(ob, ctx)
    }

    return Object.keys(ob).reduce((result, key) => {
      const processedValue = passData(ob[key], ctx)
      if (isObject(processedValue)) {
        return Object.assign(result, { [key]: process(processedValue) })
      }

      if (Array.isArray(processedValue)) {
        return Object.assign(result, { [key]: processedValue.map(process) })
      }

      return Object.assign(result, { [key]: processedValue })
    }, {})
  }

  return process(obj)
}

export const prop = (path: string): SyncFunction => (ctx: Context = {}) => {
  const paths = path.split('.')

  return paths.reduce((prev, token) => {
    if (prev && token in prev && prev[token] !== undefined) {
      return prev[token]
    }
    return undefined
  }, ctx)
}

export const equals = (
  sourceA: SyncFunction,
  sourceB: SyncFunction
): SyncPredicate => (ctx: Context = {}) => sourceA(ctx) === sourceB(ctx)

export const every = (...conditions: SyncPredicate[]): SyncPredicate => (
  ctx: Context = {}
) => conditions.every(condition => condition(ctx))

export const some = (...conditions: SyncPredicate[]): SyncPredicate => (
  ctx: Context = {}
) => conditions.some(condition => condition(ctx))

export type TracerCreatorFunction = (path: string, value: any) => any
export type TracerFunction = (path: string) => AsyncFunction

export const createTracer = (tracer: TracerCreatorFunction): TracerFunction => (
  path: string
): AsyncFunction => (ctx: Context = {}) => {
  const value = prop(path)(ctx)
  return Promise.resolve(tracer(path, value)).then(() => ctx)
}

export const consoleTracer = createTracer((path, value) => {
  console.log(`${path} = ${JSON.stringify(value)}`)
})

const mergeAll = (array: {}[]): {} =>
  array.reduce((prev, item) => (prev && Object.assign(prev, item)) || item, {})

export const composer = (...partsFn: AsyncFunction[]): AsyncFunction => ctx =>
  Promise.all(partsFn.map(partFn => partFn(ctx))).then(mergeAll)
