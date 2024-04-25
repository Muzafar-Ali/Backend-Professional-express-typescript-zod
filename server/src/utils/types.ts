import mongoose from "mongoose";

export interface UserInputType {
  name: string;
  email: string;
  password: string;
}

export interface UserDocumentType extends UserInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface SessionDocumentType extends mongoose.Document {
  user: UserDocumentType["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionInputType {
  user: UserDocumentType["_id"];
  userAgent: string;
}

export interface ProductInputType {
  user: UserDocumentType["_id"];
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface ProductDocumentType extends ProductInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface GoogleOauthTokensType {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface GoogleUserType {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

