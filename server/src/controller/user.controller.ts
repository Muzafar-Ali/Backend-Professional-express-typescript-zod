import { Request, Response } from "express";
import { createUser, validatePassword, } from "../services/user.service"
import { createUserInputType } from "../schemaValidation/user.schema";

export const createUserHandler = async (req: Request<{},{},createUserInputType["body"] >, res: Response) => {
  try {
    
    const user = await createUser(req.body);
    return res.status(201).json(user);
    
  } catch (error: any) {
    return res.status(409).send(error.message);
  }
}

export const getCurrentUser = (req: Request, res: Response,) => {
  return res.send(res.locals.user)
}