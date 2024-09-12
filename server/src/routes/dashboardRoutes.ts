import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardController";
import morganMiddleware from "../middlewares/morgan-middleware";

const router = Router()
console.log(morganMiddleware)
router.get("/", getDashboardMetrics)
// router.get("/logs", morganMiddleware)
export default router