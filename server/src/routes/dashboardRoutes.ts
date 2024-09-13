import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardController";
const router = Router()
router.get("/", getDashboardMetrics)
router.get("/logs", (req, res, next) => {
    var fs = require('fs');
    const string = fs.readFileSync(__dirname + "/all.log", "utf8");
    console.log('looking for file', string)
    res.send(string);

    // res.send('GET request to the homepage')
    // fs.readFileSync(__dirname + "/all.log", "utf8", function (err: any, data: any) {
    //     if (err) throw err;

    //     var resultArray = data//do operation on data that generates say resultArray;

    //     res.send(resultArray);
    // }); next()
})
export default router