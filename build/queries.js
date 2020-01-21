function isObject(value) {
    return (value !== null &&
        typeof value === 'object' &&
        Array.isArray(value) === false &&
        !(value instanceof Date));
}
export var always = function (data) { return function () { return data; }; };
export var props = function (obj) { return function (ctx) {
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
export var prop = function (path) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var paths = path.split('.');
    return paths.reduce(function (prev, token) {
        if (prev && token in prev && prev[token] !== undefined) {
            return prev[token];
        }
        return undefined;
    }, ctx);
}; };
export var equals = function (sourceA, sourceB) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    return sourceA(ctx) === sourceB(ctx);
}; };
export var every = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (ctx) {
        if (ctx === void 0) { ctx = {}; }
        return conditions.every(function (condition) { return condition(ctx); });
    };
};
export var some = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (ctx) {
        if (ctx === void 0) { ctx = {}; }
        return conditions.some(function (condition) { return condition(ctx); });
    };
};
export var createTracer = function (tracer) { return function (path) { return function (ctx) {
    if (ctx === void 0) { ctx = {}; }
    var value = prop(path)(ctx);
    return Promise.resolve(tracer(path, value)).then(function () { return ctx; });
}; }; };
export var consoleTracer = createTracer(function (path, value) {
    console.log(path + " = " + JSON.stringify(value));
});
var mergeAll = function (array) {
    return array.reduce(function (prev, item) { return (prev && Object.assign(prev, item)) || item; }, {});
};
export var composer = function () {
    var partsFn = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        partsFn[_i] = arguments[_i];
    }
    return function (ctx) {
        return Promise.all(partsFn.map(function (partFn) { return partFn(ctx); })).then(mergeAll);
    };
};
//# sourceMappingURL=queries.js.map