"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpExceptions_1 = require("../utils/httpExceptions");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const permissions_1 = require("../config/permissions");
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = process.env;
class Auth {
    constructor() { }
    verifyToken(req, _res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorization } = req.headers;
                if (!authorization)
                    throw new httpExceptions_1.HttpException(401, "Unauthorized");
                const [type, token] = authorization.split(" ");
                if (type !== "Bearer")
                    throw new httpExceptions_1.HttpException(401, "Unauthorized");
                const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
                req.user = decoded;
                next();
            }
            catch (err) {
                next(err);
            }
        });
    }
    verifyRoles(allowedRoles) {
        return (req, _res, next) => {
            var _a;
            if (!req.user || !((_a = req.user) === null || _a === void 0 ? void 0 : _a.roles))
                throw new httpExceptions_1.HttpException(403, "Forbidden");
            const hasRoles = req.user.roles.some((role) => allowedRoles.includes(role));
            if (!hasRoles)
                throw new httpExceptions_1.HttpException(403, "Forbidden");
            next();
        };
    }
    verifyPermissions(permission) {
        return (req, _res, next) => {
            var _a, _b;
            console.log(req.user, (_a = req.user) === null || _a === void 0 ? void 0 : _a.roles);
            if (!req.user || !((_b = req.user) === null || _b === void 0 ? void 0 : _b.roles))
                throw new httpExceptions_1.HttpException(403, "Forbidden");
            const userPermissions = (0, permissions_1.getPermissionsByRoles)(req.user.roles);
            if (!userPermissions || !userPermissions.includes(permission))
                throw new httpExceptions_1.HttpException(403, `You are forbidden to ${permission}`);
            next();
        };
    }
}
exports.default = Auth;
