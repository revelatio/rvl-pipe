import { AsyncFunction, Context, SyncFunction, SyncPredicate } from './defs'

export const set = (prop: SyncFunction): AsyncFunction => (ctx: Context = {}) =>
  Promise.resolve(Object.assign({}, ctx, prop(ctx)))

export const iff = (
  condition: SyncPredicate,
  fn: AsyncFunction,
  elseFn?: AsyncFunction
): AsyncFunction => (ctx: Context = {}) => {
  const value = condition(ctx)

  if (value) {
    return Promise.resolve(fn(ctx))
  }

  if (elseFn) {
    return Promise.resolve(elseFn(ctx))
  }

  return Promise.resolve(ctx)
}

export const all = (...tasks: AsyncFunction[]): AsyncFunction => (ctx: Context = {}) =>
  Promise.all(tasks.map(task => task(ctx))).then(contexts => Object.assign({}, ...contexts))

export const each = (...tasks: (AsyncFunction | SyncFunction)[]): AsyncFunction => (
  ctx: Context = {}
) => Promise.resolve(tasks.reduce((result, task) => result.then(task), Promise.resolve(ctx)))

export const should = (predicate: SyncPredicate, errorCode: string | Error): AsyncFunction => (
  ctx: Context = {}
) => {
  const passes = predicate(ctx)

  if (!passes) {
    if (errorCode instanceof Error) {
      return Promise.reject(errorCode)
    }

    return Promise.reject(new Error(errorCode))
  }

  return Promise.resolve(ctx)
}

export const noop = (): AsyncFunction => (ctx: Context = {}) => Promise.resolve(ctx)

export const loop = (condition: SyncPredicate, body: AsyncFunction): AsyncFunction => (
  ctx: Context = {}
) => {
  const bodyPromise: AsyncFunction = ctx =>
    body(ctx).then(context => {
      return Promise.resolve(condition(context)).then(conditionResult => {
        if (!conditionResult) {
          return context
        }

        return bodyPromise(context)
      })
    })

  return bodyPromise(ctx)
}

export const assign = (propName: string, composerFn: AsyncFunction): AsyncFunction => (
  ctx: Context = {}
) => Promise.resolve(composerFn(ctx)).then(value => Object.assign(ctx, { [propName]: value }))
