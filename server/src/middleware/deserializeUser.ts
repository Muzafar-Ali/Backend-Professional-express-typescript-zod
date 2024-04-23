import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/helper";
import { reIssueAccessToken } from "../services/session.services";
import config from "config";

const deserializeUser = async (req: Request, res:Response, next: NextFunction) => {
  
 const accessToken = get(req, "cookies.accessToken") || get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
console.log('accessToken', {accessToken});

 const refreshToken = get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");
 console.log('refreshToken', {refreshToken});

 if (!accessToken) return next();

 const { decoded, expired } = verifyJwt(accessToken);
 
 if (decoded) {
   res.locals.user = decoded;
   return next();
  }
  
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", newAccessToken, {
        maxAge: config.get('maxAgeAccesToken'), // 15 mins
        httpOnly: true,
        domain: config.get('domain'),
        path: config.get('path'),
        sameSite: "strict",
        secure: config.get('secure'),
      });
    }

    const result = verifyJwt(newAccessToken as string);

    res.locals.user = result.decoded;
    return next();
  }
   
    return next();
  }

export default deserializeUser;