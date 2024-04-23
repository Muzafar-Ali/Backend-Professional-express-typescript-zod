import dotenv from "dotenv";
dotenv.config();

export default {
  port: 1337,
  origin: "http://localhost:3000",
  domain: "localhost",
  path: "/",
  secure: process.env.NODE_ENV === "development" ? false : true,
  maxAgeAccesToken: 900000, // 15 mins for accessToken
  maxAgeRefreshToken: 3.154e10, // 1 year for refreshToken
  dbUri: process.env.MONGODB_URL,
  saltWorkFactor: 10,
  accessTokenLife: "15m",
  refreshTokenLife: "1y",
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
};
