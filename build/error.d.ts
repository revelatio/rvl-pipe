import { AsyncFunction } from './defs';
export declare const capture: (step: AsyncFunction, handler: AsyncFunction | {
    [key: string]: AsyncFunction;
}) => AsyncFunction;
export declare const ensure: (step: AsyncFunction, handler: AsyncFunction) => AsyncFunction;
