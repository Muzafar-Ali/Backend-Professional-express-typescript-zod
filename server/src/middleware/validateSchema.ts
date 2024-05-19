import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

function validateSchema(schema: AnyZodObject) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = validatedData.body;
      req.query = validatedData.query;
      req.params = validatedData.params;

      next();
    } catch (error: any) {
      const messages = error.errors.map((item: any) => item.message);
      return res.status(400).json({ errors: messages });
    }
  };
}

export default validateSchema;
