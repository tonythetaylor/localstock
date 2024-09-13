import express, { Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import ErrorHandler from "./middlewares/errorHandler"
import { HttpException } from "./utils/httpExceptions"
import Auth from "./middlewares/auth";
// import { errorMorgan, infoMorgan } from "./middlewares/morgan-middleware";
import morganMiddleware from "./middlewares/morgan-middleware";
/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import { connectToDB } from "./config/db";
import { AuthRoutes } from "./routes/authRoutes";
import { Role } from "@prisma/client";
import {errorHandler} from "./utils/error-handler";
import {errorMorgan, infoMorgan} from "./utils/morgan-middleware";

/* CONFIGURATIONS */
dotenv.config();
const app = express();

// Logging
// app.use(morgan("common"));
app.use(errorMorgan);
app.use(infoMorgan);
// app.use(morganMiddleware)
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
//Error handling
app.use(ErrorHandler);
app.use(errorHandler);
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


//Handling not existing routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpException(404, "Route not found"));
});


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

