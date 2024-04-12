import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";


function validateSchema(schema: AnyZodObject){
    
  return function(req: Request, res: Response, next: NextFunction){
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()
    } catch (error: any) {
      const message = error.errors.map((item: any) => item.message)
      return res.status(400).send(message)
    }
  }
    
}

export default validateSchema;