"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const userValidations_1 = require("../validations/userValidations");
const auth_1 = __importDefault(require("../middlewares/auth"));
const authMiddleware = new auth_1.default();
const router = (0, express_1.Router)();
router.get("/", userController_1.getUsers);
router.get("/:id", userController_1.getPrismaUsersById);
router.post("/register", (0, validateRequest_1.default)(userValidations_1.createUserSchema), userController_1.createUser);
// router.get("/:id", getUserById);
router.patch("/:id", (0, validateRequest_1.default)(userValidations_1.updateUserSchema), userController_1.updateUser);
router.delete("/:id", authMiddleware.verifyPermissions("delete"), userController_1.deleteUser);
exports.default = router;
