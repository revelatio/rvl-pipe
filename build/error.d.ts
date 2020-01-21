import { AsyncFunction } from './defs';
export declare class ContextError extends Error {
    context: {};
    constructor(message: string, context: {});
}
export declare const capture: (step: AsyncFunction, handler: AsyncFunction | {
    [key: string]: AsyncFunction;
}) => AsyncFunction;
export declare const ensure: (step: AsyncFunction, handler: AsyncFunction) => AsyncFunction;
