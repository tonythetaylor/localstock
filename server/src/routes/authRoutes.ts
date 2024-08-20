import { Router } from "express";
import AuthController from "../controllers/authentication";
import ValidateRequest from "../middlewares/validateRequest";
import { loginUserSchema, registerUserSchema } from "../validations/userValidations";

const router = Router();
const authController = new AuthController();

router
  .post("/login", ValidateRequest(loginUserSchema), authController.login.bind(authController))
  .post(
    "/register",
    ValidateRequest(registerUserSchema),
    authController.register.bind(authController)
  )
  .post("/refresh", authController.refresh.bind(authController))
  .post("/logout", authController.logout.bind(authController));

export { router as AuthRoutes };
