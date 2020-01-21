export declare type Context = {
    [key: string]: any;
};
export declare type AsyncFunction = (ctx?: Context) => Promise<Context>;
export declare type SyncFunction = (ctx: Context) => any;
export declare type SyncPredicate = (ctx: Context) => boolean;
