var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { ContextError } from './error';
export var set = function (prop) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    return Promise.resolve(Object.assign({}, ctx, prop(ctx)));
}; };
export var iff = function (condition, fn, elseFn) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var value = condition(ctx);
    if (value) {
        return Promise.resolve(fn(ctx));
    }
    if (elseFn) {
        return Promise.resolve(elseFn(ctx));
    }
    return Promise.resolve(ctx);
}; };
export var all = function () {
    var tasks = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tasks[_i] = arguments[_i];
    }
    return function (ctx) {
        if (ctx === void 0) { ctx = {}; }
        return Promise.all(tasks.map(function (task) { return task(ctx); }))
            .then(function (contexts) { return Object.assign.apply(Object, __spreadArrays([{}], contexts)); })
            .catch(function (error) { return Promise.reject(new ContextError(error.message, ctx)); });
    };
};
export var each = function () {
    var tasks = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tasks[_i] = arguments[_i];
    }
    return function (ctx) {
        if (ctx === void 0) { ctx = {}; }
        return Promise.resolve(tasks.reduce(function (result, task) { return result.then(task); }, Promise.resolve(ctx))).catch(function (error) { return Promise.reject(new ContextError(error.message, ctx)); });
    };
};
export var should = function (predicate, errorCode) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var passes = predicate(ctx);
    if (!passes) {
        return Promise.reject(new ContextError(errorCode, ctx));
    }
    return Promise.resolve(ctx);
}; };
export var noop = function () { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    return Promise.resolve(ctx);
}; };
export var loop = function (condition, body) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var bodyPromise = function (ctx) {
        return body(ctx).then(function (context) {
            return Promise.resolve(condition(context)).then(function (conditionResult) {
                if (!conditionResult) {
                    return context;
                }
                return bodyPromise(context);
            });
        });
    };
    return bodyPromise(ctx);
}; };
export var assign = function (propName, composerFn) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    return Promise.resolve(composerFn(ctx)).then(function (value) {
        var _a;
        return Object.assign(ctx, (_a = {}, _a[propName] = value, _a));
    });
}; };
//# sourceMappingURL=functions.js.map