import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "../services/session.services";
import {
  findAndUpsertUser,
  getGoogleOauthTokens,
  getGoogleUser,
  validatePassword,
} from "../services/user.service";
import { CreateSessionInputType } from "../schemaValidation/sesssion.schema";
import { accessTokenCookieOptions, refreshTokenCookieOptions, signJwt } from "../utils/helper";
import { GoogleOauthTokensType, GoogleUserType} from "../utils/types";
import config from "config";
import jwt from "jsonwebtoken";




export const createUserSessionHandler = async (
  req: Request<{}, {}, CreateSessionInputType["body"]>,
  res: Response
) => {
  try {
    // validate the user password
    const user = await validatePassword(req.body);

    if (!user) return res.status(401).send("Invalid email or password");

    // create Session
    const session = await createSession(user._id, req.get("user-agent") || "");

    //create an access token
    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get("accessTokenLife") } // 15 minutes
    );

    // create a refresh token
    const refreshToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get("refreshTokenLife") } // 15 minutes
    );

    // set cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    // return access & refresh tokens
    return res.send({ accessToken, refreshToken });
  } catch (error: any) {
    res.status(500).json({ error: error.message as string });
  }
};

export const getUserSession = async (req: Request, res: Response) => {
  const user = res.locals.user._id;

  const sessions = await findSessions({ user, valid: true });
  return res.send(sessions);
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
 
  try {
    const sessionId = res.locals.user.session;
    console.log('Session id :', sessionId);
    
 
    const sesssionDeleted = await updateSession({ _id: sessionId }, { valid: false });
    console.log('sesssionDeleted', sesssionDeleted);
    
    if (!sesssionDeleted.acknowledged) return res.status(404).send("Session not found");
  
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  
    return res.send({
      accessToken: null,
      refreshToken: null,
    });
    
  } catch (error) {
    console.log('Delete session error :',error);
    return res.status(500).send("An error occurred while deleting the session")
  }
};

export const googleOauthHandler = async (req: Request, res: Response) => {
  try {
    const code = req.query.code;

    if (typeof code === "string") {
      // get id token and access token from google
      const { id_token, access_token }: GoogleOauthTokensType = await getGoogleOauthTokens({ code });

      // get user from token
      // const user = jwt.decode(id_token);
      const googleUser: GoogleUserType = await getGoogleUser({
        id_token,
        access_token,
      });

      if (!googleUser.verified_email)
        return res.status(403).send("Google account is not verified");

      // upsert the user
      const user = await findAndUpsertUser(
        {
          email: googleUser.email,
        },
        {
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        },
        {
          upsert: true,
          new: true,
        }
      );

      if (!user) return res.status(404).send("User not found or could not be created");

      // create session
      const session = await createSession(
        user?._id,
        req.get("user-agent") || ""
      );

      // create access token
      const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("accessTokenLife") } // 15 minutes
      );

      // create refresh token
      const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("refreshTokenLife") } // 15 minutes
      );

      // set cookies
      res.cookie("accessToken", accessToken, accessTokenCookieOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      // redirect back to client
      res.redirect(config.get("origin"));
    }
  } catch (error) {
    console.log('googleOauthHandler error:',error);
    return res.redirect(`${config.get("origin")}/oauth/error`);
  }
};
