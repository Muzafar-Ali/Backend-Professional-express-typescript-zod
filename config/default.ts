import dotenv from 'dotenv'
dotenv.config()

export default {
  port: 1337,
  dbUri: process.env.MONGODB_URL,
  saltWorkFactor: 10,
  accessTokenLife: "1m",
  refreshTokenLife: "1y",
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
};


