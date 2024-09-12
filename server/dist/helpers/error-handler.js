"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_error_1 = require("./api-error");
const errorHandler = (err, req, res, next) => {
    res.locals.errorId = Math.floor(Math.random() * 1000000);
    const errorStatusCode = err instanceof api_error_1.ApiError ? err.statusCode : 500;
    res.locals.errorMessage = err.message;
    res.locals.errorStack = err.stack;
    res.status(errorStatusCode).json({ errorId: res.locals.errorId, message: err.message });
};
exports.errorHandler = errorHandler;
