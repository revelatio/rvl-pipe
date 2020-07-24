import { AsyncFunction, Context } from './defs'

export class ContextError extends Error {
  context: any

  constructor (message: string, context: {}) {
    super(message)
    this.name = 'ContextError'
    this.message = message
    this.context = context

    Object.setPrototypeOf(this, Error.prototype)
  }
}

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

export const ensure = (
  step: AsyncFunction,
  handler: AsyncFunction
): AsyncFunction => ctx => {
  return step(ctx)
    .catch(error => Promise.resolve(error.context))
    .then(handler)
}
