import express, { Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import ErrorHandler from "./middlewares/errorHandler"
import { HttpException } from "./utils/httpExceptions"
import Auth from "./middlewares/auth";
import { errorHandler } from "./helpers/error-handler";
import { errorMorgan, infoMorgan } from "./middlewares/morgan-middleware";
/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import { connectToDB } from "./config/db";
import { AuthRoutes } from "./routes/authRoutes";
import { Role } from "@prisma/client";
/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(errorMorgan);
app.use(infoMorgan);
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
const authMiddleware = new Auth();
app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/users",
// authMiddleware.verifyToken,
  // authMiddleware.verifyRoles([Role.MANAGER, Role.ADMIN, Role.USER]),
   userRoutes); // http://localhost:8000/users
app.use("/expenses", expenseRoutes); // http://localhost:8000/expenses
app.use("/auth", AuthRoutes); // http://localhost:8000/auth

app.use(errorHandler);

//Handling not existing routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpException(404, "Route not found"));
});

//Error handling
app.use(ErrorHandler);

/* SERVER */
const port = Number(process.env.PORT) || 3001;
const initializeApp = async () => {
  try {
    app.listen(port, "0.0.0.0", () => {
      console.log(`[server]: server is running on port ${port}`);
    });
    await connectToDB()
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

initializeApp()

