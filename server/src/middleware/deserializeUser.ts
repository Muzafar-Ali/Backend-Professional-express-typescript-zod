import { NextFunction, Request, Response } from "express";
import { get, omit } from "lodash";
import { verifyJwt } from "../utils/helper";
import { reIssueAccessToken } from "../services/session.services";

const deserializeUser = async (req: Request, res:Response, next: NextFunction) => {
  
 const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
 if (!accessToken) return next();
 
 const refreshToken = get(req, "headers.x-refresh") as string
 const { decoded, expired } = verifyJwt(accessToken, "accessTokenPublicKey");
 
 if (decoded) {
   res.locals.user = decoded;
   return next();
  }
  
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }
    const result = verifyJwt(newAccessToken as string, "accessTokenPublicKey");

    if (typeof result.decoded === 'object' && result.decoded !== null) {
      res.locals.user = omit(result.decoded, "password");      
    }
   
    return next();
  }
}   

export default deserializeUser;