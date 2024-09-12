"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const morgan_middleware_1 = __importDefault(require("../middlewares/morgan-middleware"));
const router = (0, express_1.Router)();
console.log(morgan_middleware_1.default);
router.get("/", dashboardController_1.getDashboardMetrics);
// router.get("/logs", morganMiddleware)
exports.default = router;
