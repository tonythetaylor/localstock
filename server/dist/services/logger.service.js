"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const fileFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.uncolorize(), winston_1.default.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
}), winston_1.default.format.prettyPrint({
    depth: 5
}), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
}), winston_1.default.format.prettyPrint({
    depth: 5
}), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
const consoleTransport = new winston_1.default.transports.Console({
    format: consoleFormat,
});
const combinedFileTransport = new winston_1.default.transports.DailyRotateFile({
    filename: '%DATE%_combined.log',
    format: fileFormat, //format means - how the log should be formatted
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '2m',
    dirname: './logs/combined',
    maxFiles: '14d',
});
const errorFileTransport = new winston_1.default.transports.DailyRotateFile({
    filename: '%DATE%_error.log',
    level: 'error',
    format: fileFormat, //format means - how the log should be formatted
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '2m',
    dirname: './logs/errors',
    maxFiles: '14d',
});
const httpTransport = new winston_1.default.transports.Http({
    format: winston_1.default.format.json(),
    host: 'localhost',
    port: 4000,
    path: '/logs',
    ssl: false,
    batch: true,
    batchCount: 10,
    batchInterval: 10000,
});
const logger = winston_1.default.createLogger({
    levels: winston_1.default.config.syslog.levels,
    transports: [
        errorFileTransport,
        combinedFileTransport,
        consoleTransport,
        httpTransport,
    ],
});
exports.default = logger;
