"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMorgan = exports.infoMorgan = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./logger");
morgan_1.default.token('id', (req, res) => {
    return res.locals.errorId;
});
const incomingMessage = (tokens, req, res) => {
    return [
        tokens.id(req, res),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
};
const infoStream = {
    write: (message) => logger_1.logger.info(message.trim())
};
const errorStream = {
    write: (message) => logger_1.logger.error(message.trim())
};
exports.infoMorgan = (0, morgan_1.default)(incomingMessage, {
    stream: infoStream, immediate: false
});
exports.errorMorgan = (0, morgan_1.default)((tokens, req, res) => {
    return [
        incomingMessage(tokens, req, res),
        res.locals.errorMessage,
        res.locals.errorStack
    ].join(' ');
}, {
    stream: errorStream, skip(req, res) {
        return res.statusCode < 400;
    }
});
