"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const httpExceptions_1 = require("../utils/httpExceptions");
const ValidateRequest = (validationSchema) => {
    return (req, _res, next) => {
        try {
            validationSchema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const errorMessages = err.errors.map((error) => `${error.path.join(".")} is 
        ${error.message.toLowerCase()}`);
                next(new httpExceptions_1.HttpValidationExceptions(errorMessages));
            }
        }
    };
};
exports.default = ValidateRequest;
