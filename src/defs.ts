export type Context = { [key: string]: any }

export type AsyncFunction = (ctx?: Context) => Promise<Context>

export type SyncFunction = (ctx: Context) => any

export type SyncPredicate = (ctx: Context) => boolean
