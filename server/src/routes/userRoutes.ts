import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser, } from "../controllers/userController";
import ValidateRequest from "../middlewares/validateRequest";
import { createUserSchema, updateUserSchema } from "../validations/userValidations";
import Auth from "../middlewares/auth";

const authMiddleware = new Auth();
const router = Router();

router.get("/", getUsers);
router.post("/register", ValidateRequest(createUserSchema), createUser);
router.get("/:id", getUserById);
router.patch("/:id", ValidateRequest(updateUserSchema), updateUser);
router.delete("/:id",  authMiddleware.verifyPermissions("delete"),deleteUser);

export default router;
