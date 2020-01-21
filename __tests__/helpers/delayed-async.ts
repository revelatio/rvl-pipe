import { AsyncFunction } from '../../src'

export const delayedAsync = (
  delay: number,
  obj: Object
): AsyncFunction => context =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(Object.assign(context, obj))
    }, delay)
  )

export const delayedFail = (
  delay: number,
  error: string
): AsyncFunction => () =>
  new Promise((__, reject) =>
    setTimeout(() => {
      reject(new Error(error))
    }, delay)
  )
