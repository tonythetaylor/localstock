import type { Request, Response, NextFunction } from "express";
import { type z, ZodError } from "zod";
import { HttpValidationExceptions } from "../utils/httpExceptions";

const ValidateRequest = (validationSchema: z.Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      validationSchema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages = err.errors.map(
        (error) => `${error.path.join(".")} is 
        ${error.message.toLowerCase()}`);
        next(new HttpValidationExceptions(errorMessages));
      }
    }
  };
};
export default ValidateRequest;