var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ContextError = /** @class */ (function (_super) {
    __extends(ContextError, _super);
    function ContextError(message, context) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ContextError';
        _this.message = message || '';
        _this.context = context;
        Object.setPrototypeOf(_this, Error.prototype);
        return _this;
    }
    return ContextError;
}(Error));
export { ContextError };
export var capture = function (step, handler) { return function (ctx) {
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
export var ensure = function (step, handler) { return function (ctx) {
    return step(ctx)
        .catch(function (error) { return Promise.resolve(error.context); })
        .then(handler);
}; };
//# sourceMappingURL=error.js.map