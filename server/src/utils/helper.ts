import mongoose from "mongoose";
import config  from "config";
import log from "./logger";
import Jwt from 'jsonwebtoken';
import { CookieOptions } from "express";

export const connectDB = async () => {
  const { connection } = await mongoose.connect(config.get<string>("dbUri"))
  log.info(`MongoDB connected with ${connection.host}`)
  return connection.host;
}

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

export const accessTokenCookieOptions: CookieOptions = {
  maxAge: config.get("maxAgeAccessToken"), // 15 mins
  httpOnly: true,
  domain: config.get("domain"),
  path: config.get("path"),
  sameSite: "strict",
  secure: config.get("secure"),
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: config.get("maxAgeRefreshToken"), // 1 year
};

export function signJwt( object: Object, options?: Jwt.SignOptions | undefined ) {
  return Jwt.sign(
    object, 
    privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}
  
export function verifyJwt(token: string) {
  try {
    const decoded = Jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}

