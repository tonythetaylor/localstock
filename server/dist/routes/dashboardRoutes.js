"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.get("/", dashboardController_1.getDashboardMetrics);
router.get("/logs", (req, res, next) => {
    var fs = require('fs');
    const string = fs.readFileSync(__dirname + "/all.log", "utf8");
    console.log('looking for file', string);
    res.send(string);
    // res.send('GET request to the homepage')
    // fs.readFileSync(__dirname + "/all.log", "utf8", function (err: any, data: any) {
    //     if (err) throw err;
    //     var resultArray = data//do operation on data that generates say resultArray;
    //     res.send(resultArray);
    // }); next()
});
exports.default = router;
