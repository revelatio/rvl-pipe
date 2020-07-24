'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var capture = function (step, handler) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    return step(ctx).catch(function (error) {
        if (typeof handler === 'function') {
            return Promise.resolve(handler(ctx));
        }
        if (!(error.message in handler)) {
            return Promise.reject(error);
        }
        return Promise.resolve(handler[error.message](ctx));
    });
}; };
var ensure = function (step, handler) { return function (ctx) {
    return step(ctx)
        .catch(function () { return Promise.resolve(ctx); })
        .then(handler);
}; };

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var set = function (prop) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    return Promise.resolve(Object.assign({}, ctx, prop(ctx)));
}; };
var iff = function (condition, fn, elseFn) { return function (ctx) {
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
var all = function () {
    var tasks = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tasks[_i] = arguments[_i];
    }
    return function (ctx) {
        if (ctx === void 0) { ctx = {}; }
        return Promise.all(tasks.map(function (task) { return task(ctx); })).then(function (contexts) { return Object.assign.apply(Object, __spreadArrays([{}], contexts)); });
    };
};
var each = function () {
    var tasks = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tasks[_i] = arguments[_i];
    }
    return function (ctx) {
        if (ctx === void 0) { ctx = {}; }
        return Promise.resolve(tasks.reduce(function (result, task) { return result.then(task); }, Promise.resolve(ctx)));
    };
};
var should = function (predicate, errorCode) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var passes = predicate(ctx);
    if (!passes) {
        if (errorCode instanceof Error) {
            return Promise.reject(errorCode);
        }
        return Promise.reject(new Error(errorCode));
    }
    return Promise.resolve(ctx);
}; };
var noop = function () { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    return Promise.resolve(ctx);
}; };
var loop = function (condition, body) { return function (ctx) {
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
var assign = function (propName, composerFn) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    return Promise.resolve(composerFn(ctx)).then(function (value) {
        var _a;
        return Object.assign(ctx, (_a = {}, _a[propName] = value, _a));
    });
}; };

function isObject(value) {
    return (value !== null &&
        typeof value === 'object' &&
        Array.isArray(value) === false &&
        !(value instanceof Date));
}
var always = function (data) { return function () { return data; }; };
var props = function (obj) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var passData = function (fnOrObj, data) {
        return typeof fnOrObj === 'function' ? fnOrObj(data) : fnOrObj;
    };
    function process(ob) {
        if (!isObject(ob)) {
            return passData(ob, ctx);
        }
        return Object.keys(ob).reduce(function (result, key) {
            var _a, _b, _c;
            var processedValue = passData(ob[key], ctx);
            if (isObject(processedValue)) {
                return Object.assign(result, (_a = {}, _a[key] = process(processedValue), _a));
            }
            if (Array.isArray(processedValue)) {
                return Object.assign(result, (_b = {}, _b[key] = processedValue.map(process), _b));
            }
            return Object.assign(result, (_c = {}, _c[key] = processedValue, _c));
        }, {});
    }
    return process(obj);
}; };
var prop = function (path) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var paths = path.split('.');
    return paths.reduce(function (prev, token) {
        if (prev && token in prev && prev[token] !== undefined) {
            return prev[token];
        }
        return undefined;
    }, ctx);
}; };
var equals = function (sourceA, sourceB) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    return sourceA(ctx) === sourceB(ctx);
}; };
var every = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (ctx) {
        if (ctx === void 0) { ctx = {}; }
        return conditions.every(function (condition) { return condition(ctx); });
    };
};
var some = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (ctx) {
        if (ctx === void 0) { ctx = {}; }
        return conditions.some(function (condition) { return condition(ctx); });
    };
};
var createTracer = function (tracer) { return function (path) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var value = prop(path)(ctx);
    return Promise.resolve(tracer(path, value)).then(function () { return ctx; });
}; }; };
var consoleTracer = createTracer(function (path, value) {
    console.log(path + " = " + JSON.stringify(value));
});
var mergeAll = function (array) {
    return array.reduce(function (prev, item) { return (prev && Object.assign(prev, item)) || item; }, {});
};
var composer = function () {
    var partsFn = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        partsFn[_i] = arguments[_i];
    }
    return function (ctx) {
        return Promise.all(partsFn.map(function (partFn) { return partFn(ctx); })).then(mergeAll);
    };
};

exports.all = all;
exports.always = always;
exports.assign = assign;
exports.capture = capture;
exports.composer = composer;
exports.consoleTracer = consoleTracer;
exports.createTracer = createTracer;
exports.each = each;
exports.ensure = ensure;
exports.equals = equals;
exports.every = every;
exports.iff = iff;
exports.loop = loop;
exports.noop = noop;
exports.prop = prop;
exports.props = props;
exports.set = set;
exports.should = should;
exports.some = some;
//# sourceMappingURL=index.js.map
