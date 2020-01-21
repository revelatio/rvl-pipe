import { AsyncFunction, SyncFunction, SyncPredicate } from './defs';
export declare const set: (prop: SyncFunction) => AsyncFunction;
export declare const iff: (condition: SyncPredicate, fn: AsyncFunction, elseFn?: AsyncFunction | undefined) => AsyncFunction;
export declare const all: (...tasks: AsyncFunction[]) => AsyncFunction;
export declare const each: (...tasks: (SyncFunction | AsyncFunction)[]) => AsyncFunction;
export declare const should: (predicate: SyncPredicate, errorCode: string) => AsyncFunction;
export declare const noop: () => AsyncFunction;
export declare const loop: (condition: SyncPredicate, body: AsyncFunction) => AsyncFunction;
export declare const assign: (propName: string, composerFn: AsyncFunction) => AsyncFunction;
