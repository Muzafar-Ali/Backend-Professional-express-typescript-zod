import mongoose from "mongoose";
import config  from "config";
import log from "./logger";

import Jwt from 'jsonwebtoken';

export const connectDB = async () => {
  const { connection } = await mongoose.connect(config.get<string>("dbUri"))
  log.info(`MongoDB connected with ${connection.host}`)
  return connection.host;
}

export const signJwt = (
    object: Object, 
    keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options?: Jwt.SignOptions | undefined
  ) => {
    
  return Jwt.sign(
    object, 
    config.get<string>(keyName), 
    {
      ...(options && options),
      algorithm: 'RS256',
    }
  );   
}
  
export const verifyJwt = ( token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey" ) => {
  try {
    const decoded = Jwt.verify(token, config.get(keyName));
 
    return {
      valid: true,
      expired: false,
      decoded,
    };

  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
