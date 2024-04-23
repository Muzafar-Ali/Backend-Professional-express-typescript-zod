import mongoose from "mongoose";
import config  from "config";
import log from "./logger";
import Jwt from 'jsonwebtoken';

export const connectDB = async () => {
  const { connection } = await mongoose.connect(config.get<string>("dbUri"))
  log.info(`MongoDB connected with ${connection.host}`)
  return connection.host;
}

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

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

