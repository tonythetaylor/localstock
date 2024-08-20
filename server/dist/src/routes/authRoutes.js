"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const authentication_1 = __importDefault(require("../controllers/authentication"));
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const userValidations_1 = require("../validations/userValidations");
const router = (0, express_1.Router)();
exports.AuthRoutes = router;
const authController = new authentication_1.default();
router
    .post("/login", (0, validateRequest_1.default)(userValidations_1.loginUserSchema), authController.login.bind(authController))
    .post("/register", (0, validateRequest_1.default)(userValidations_1.registerUserSchema), authController.register.bind(authController))
    .post("/refresh", authController.refresh.bind(authController))
    .post("/logout", authController.logout.bind(authController));
