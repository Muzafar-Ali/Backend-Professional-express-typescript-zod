import { omit } from "lodash";
import UserModel from "../models/user.model"
import { UserDocumentType, UserInputType } from "../utils/types"
import { FilterQuery } from "mongoose";

export const createUser = async (input: UserInputType) => {
  try {
    
    const userExist = await UserModel.findOne({ email: input.email });
    if (userExist) throw new Error("User already exist");

    const user = await UserModel.create(input);
    if (!user) throw new Error("User not created");

    return user;
     
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const validatePassword = async ({ email, password }: { email: string, password: string}) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return false;

    const isValid = await user.comparePassword(password);
    if (!isValid) return false;

    return omit(user.toJSON(), "password");

  } catch (error) { 
    throw new Error(error as string)
  }
} 

export async function findUser(query: FilterQuery<UserDocumentType>) {
  return UserModel.findOne(query).lean();
}

  
