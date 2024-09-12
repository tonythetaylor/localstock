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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const httpExceptions_1 = require("./utils/httpExceptions");
const auth_1 = __importDefault(require("./middlewares/auth"));
const error_handler_1 = require("./helpers/error-handler");
// import { errorMorgan, infoMorgan } from "./middlewares/morgan-middleware";
const morgan_middleware_1 = __importDefault(require("./middlewares/morgan-middleware"));
/* ROUTE IMPORTS */
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const db_1 = require("./config/db");
const authRoutes_1 = require("./routes/authRoutes");
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
// Logging
// app.use(errorMorgan);
// app.use(infoMorgan);
app.use(morgan_middleware_1.default);
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
//Error handling
app.use(errorHandler_1.default);
app.use(error_handler_1.errorHandler);
/* ROUTES */
const authMiddleware = new auth_1.default();
app.use("/dashboard", dashboardRoutes_1.default); // http://localhost:8000/dashboard
app.use("/products", productRoutes_1.default); // http://localhost:8000/products
app.use("/users", 
// authMiddleware.verifyToken,
// authMiddleware.verifyRoles([Role.MANAGER, Role.ADMIN, Role.USER]),
userRoutes_1.default); // http://localhost:8000/users
app.use("/expenses", expenseRoutes_1.default); // http://localhost:8000/expenses
app.use("/auth", authRoutes_1.AuthRoutes); // http://localhost:8000/auth
//Handling not existing routes
app.use((_req, _res, next) => {
    next(new httpExceptions_1.HttpException(404, "Route not found"));
});
/* SERVER */
const port = Number(process.env.PORT) || 3001;
const initializeApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(port, "0.0.0.0", () => {
            console.log(`[server]: server is running on port ${port}`);
        });
        yield (0, db_1.connectToDB)();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
initializeApp();
