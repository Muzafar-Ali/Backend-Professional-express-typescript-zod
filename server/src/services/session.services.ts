import { get } from "lodash";
import { signJwt, verifyJwt } from "../utils/helper";
import SessionModel from "../models/session.model"
import config from "config";
import { findUser } from "./user.service";

export const createSession = async (user: string, userAgent: string) => {
  const session = await SessionModel.create({ user,userAgent })
  return session.toJSON();
}

export const findSessions = async (query: any) => {
  return SessionModel.find(query).lean()
}

export const updateSession = async (query: any, update: any) => {
  return SessionModel.updateOne(query, update)
}

export const reIssueAccessToken = async ({ refreshToken }: { refreshToken: string }) => {
  
  const { decoded } = verifyJwt(refreshToken);
  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));
  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user })
  
  if (!user) return false;

  const accessToken = signJwt(
    { ...user, 
      session: session._id 
    }, 
    { expiresIn: config.get("accessTokenLife") } // 15 minutes
  );
  
  return accessToken;

}

export const deleteSession = async (query: any) => {
  return SessionModel.deleteOne(query)
}
