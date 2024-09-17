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
const bcrypt_1 = __importDefault(require("bcrypt"));
const userService_1 = __importDefault(require("./userService"));
const jwtService_1 = require("./jwtService");
const httpExceptions_1 = require("../utils/httpExceptions");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userService = new userService_1.default();
const jwtService = new jwtService_1.JwtService();
class AuthService {
    constructor() {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            if (data.phone)
                user = yield this.userService.getByKey("phone", data.phone);
            else
                user = yield this.userService.getByKey("email", data.email);
            if (!user || !(yield bcrypt_1.default.compare(data.password, user.password)))
                throw new httpExceptions_1.HttpException(400, "Wrong credentials");
            const { email, roles, userId } = user;
            console.log(userId);
            const { accessToken, refreshToken } = this.jwtService.genAuthTokens({ email, roles });
            yield this.userService.update(user.userId, { refreshToken });
            return { accessToken, refreshToken, userId };
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.userService.create(data);
            const { email, roles, userId } = newUser;
            const { accessToken, refreshToken } = this.jwtService.genAuthTokens({ email, roles });
            yield this.userService.update(newUser.userId, { refreshToken });
            return { accessToken, refreshToken, userId };
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getByKey("refreshToken", refreshToken);
            if (!user)
                throw new httpExceptions_1.HttpException(403, "Forbidden");
            const decoded = yield this.jwtService.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const isRolesMatch = user.roles.every((role) => decoded.roles.includes(role));
            if (decoded.email !== user.email || !isRolesMatch)
                throw new httpExceptions_1.HttpException(403, "Forbidden");
            const { accessToken } = this.jwtService.genAuthTokens({ email: user.email, roles: user.roles });
            return { accessToken };
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getByKey("refreshToken", refreshToken);
            if (user)
                return yield this.userService.update(user.userId, { refreshToken: "" });
        });
    }
}
exports.default = AuthService;
// export const register = async (data: RegisterUserInput): Promise<AuthTokens> => {
//     const newUser = await userService.create(data);
//     const { email } = newUser;
//     const { accessToken, refreshToken } = jwtService.genAuthTokens({ email });
//     await userService.update(newUser.userId, { refreshToken });
//     return { accessToken, refreshToken };
//   }
