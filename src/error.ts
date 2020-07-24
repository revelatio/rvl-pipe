import { AsyncFunction, Context } from './defs'

export const capture = (
  step: AsyncFunction,
  handler: { [key: string]: AsyncFunction } | AsyncFunction
): AsyncFunction => (ctx: Context = {}) => {
  return step(ctx).catch(error => {
    if (typeof handler === 'function') {
      return Promise.resolve(handler(ctx))
    }

    if (!(error.message in handler)) {
      return Promise.reject(error)
    }

    return Promise.resolve(handler[error.message](ctx))
  })
}

export const ensure = (step: AsyncFunction, handler: AsyncFunction): AsyncFunction => ctx => {
  return step(ctx)
    .catch(() => Promise.resolve(ctx))
    .then(handler)
}
