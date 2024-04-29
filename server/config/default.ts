import dotenv from "dotenv";
dotenv.config();

export default {
  port: 1337,
  origin: "http://localhost:3001",
  domain: "localhost",
  path: "/",
  secure: process.env.NODE_ENV === "development" ? false : true,
  maxAgeAccessToken: 900000, // 15 mins for accessToken
  maxAgeRefreshToken: 3.154e10, // 1 year for refreshToken
  dbUri: process.env.MONGODB_URL,
  saltWorkFactor: 10,
  accessTokenLife: "15m",
  refreshTokenLife: "1y",
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleOauthRedirectUrl: "http://localhost:1337/api/v1/sessions/oauth/google",
};
