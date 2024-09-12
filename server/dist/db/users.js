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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = void 0;
const db_1 = require("../config/db");
class UserRepository {
    constructor() {
        this.db = db_1.db;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.users.findMany();
        });
    }
    getById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.users.findUnique({ where: { userId } });
        });
    }
    getByKey(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.users.findFirst({ where: { [key]: value } });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.users.create({ data });
        });
    }
    update(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.users.update({ where: { userId }, data });
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.users.delete({ where: { userId } });
        });
    }
}
exports.default = UserRepository;
const getUserByEmail = (email) => db_1.db.users.findUnique({ where: { email } });
exports.getUserByEmail = getUserByEmail;
