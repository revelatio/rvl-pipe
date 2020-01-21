/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var ContextError = /** @class */ (function (_super) {
    __extends(ContextError, _super);
    function ContextError(message, context) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ContextError';
        _this.message = message;
        _this.context = context;
        Object.setPrototypeOf(_this, Error.prototype);
        return _this;
    }
    return ContextError;
}(Error));
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
        .catch(function (error) { return Promise.resolve(error.context); })
        .then(handler);
}; };

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
        return Promise.all(tasks.map(function (task) { return task(ctx); }))
            .then(function (contexts) { return Object.assign.apply(Object, __spreadArrays([{}], contexts)); })
            .catch(function (error) { return Promise.reject(new ContextError(error.message, ctx)); });
    };
};
var each = function () {
    var tasks = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tasks[_i] = arguments[_i];
    }
    return function (ctx) {
        if (ctx === void 0) { ctx = {}; }
        return Promise.resolve(tasks.reduce(function (result, task) { return result.then(task); }, Promise.resolve(ctx))).catch(function (error) { return Promise.reject(new ContextError(error.message, ctx)); });
    };
};
var should = function (predicate, errorCode) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var passes = predicate(ctx);
    if (!passes) {
        return Promise.reject(new ContextError(errorCode, ctx));
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

export { ContextError, all, always, assign, capture, composer, consoleTracer, createTracer, each, ensure, equals, every, iff, loop, noop, prop, props, set, should, some };
//# sourceMappingURL=index.es.js.map
