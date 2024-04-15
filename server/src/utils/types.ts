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