"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const winston_1 = __importDefault(require("winston"));
const fileTransport = new winston_daily_rotate_file_1.default({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '7d'
});
const consoleTransport = new winston_1.default.transports.Console();
exports.logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => {
        console.log(message);
        return `[${timestamp}] ${level}: ${message}`;
    })),
    transports: [
        fileTransport, consoleTransport
    ]
});
