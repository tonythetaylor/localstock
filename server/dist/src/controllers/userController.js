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
exports.deleteUser = exports.updateUser = exports.create = exports.getUserById = exports.getAllUsers = exports.createUser = exports.getUsers = void 0;
const userService_1 = __importDefault(require("../services/userService"));
const users_1 = require("../db/users");
const userService = new userService_1.default();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users" });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    // const { productId, name, price, rating, stockQuantity } = req.body;
    if (!email || !password || !name) {
        res.sendStatus(400);
    }
    const existingUser = yield (0, users_1.getUserByEmail)(email);
    if (existingUser) {
        res.sendStatus(400);
    }
    try {
        const user = yield userService.create(req.body);
        res.status(201).json({ user });
    }
    catch (err) {
        next(err);
    }
});
exports.createUser = createUser;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userService.getAll();
        res.status(200).json({ users });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.getById(req.params.id);
        res.status(200).json({ user });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserById = getUserById;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.create(req.body);
        res.status(201).json({ user });
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.update(req.params.id, req.body);
        res.status(200).json({ user });
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userService.delete(req.params.id);
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
