import { Request, Response } from "express";
import { createSession, findSessions, updateSession } from "../services/session.services";
import { validatePassword } from "../services/user.service";
import { CreateSessionInputType } from "../schemaValidation/sesssion.schema";
import { signJwt } from "../utils/helper";
import config from "config";

export const createUserSessionHandler = async (req: Request<{}, {}, CreateSessionInputType["body"]>, res: Response) => {
  try {
    
    // validate the user password
    const user = await validatePassword(req.body);
       
    if (!user) return res.status(401).send('Invalid email or password');

    // create Session
    const session = await createSession(user._id, req.get('user-agent') || '');

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

    // return access & refresh tokens
    
    res.cookie("accessToken", accessToken, {
      maxAge: config.get('maxAgeAccesToken'), // 15 mins
      httpOnly: true,
      domain: config.get('domain'),
      path: config.get('path'),
      sameSite: "strict",
      secure: config.get('secure'),
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: config.get('maxAgeRefreshToken'), // 1 year
      domain: config.get('domain'),
      path: config.get('path'),
      sameSite: "strict",
      secure: config.get('secure'),
  });

    return res.send({ accessToken, refreshToken })
  
  } catch (error: any) {
    res.status(500).json({error: error.message as string});
  }
}

export const getUserSession = async (req: Request, res: Response) => {
  const user = res.locals.user._id;
  
  const sessions = await findSessions({ user, valid: true });
  return res.send(sessions);
}

export const deleteSessionHandler = async (req: Request, res: Response) => {
  console.log('working 1');
  
  const sessionId = res.locals.user.session;
  console.log('sessionId', sessionId);
  

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}

