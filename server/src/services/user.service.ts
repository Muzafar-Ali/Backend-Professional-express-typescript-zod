import { omit } from "lodash";
import UserModel from "../models/user.model"
import { UserDocumentType, UserInputType } from "../utils/types"
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import config from "config";
import qs from "qs";
import { any } from "zod";

export const createUser = async (input: UserInputType) => {
  try {
    
    const userExist = await UserModel.findOne({ email: input.email });
    if (userExist) throw new Error("User already exist");

    const user = await UserModel.create(input);
    if (!user) throw new Error("User not created");

    return omit(user.toJSON(), "password");
     
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

export const getGoogleOauthTokens = async ({ code }: { code: string }) => {
  
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: config.get('googleClientId'),
    client_secret: config.get('googleClientSecret'),
    redirect_uri: config.get('googleOauthRedirectUrl'),
    grant_type: "authorization_code",
  };

  try {
  
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(values),
    });

    // if (!res.ok) throw new Error("Failed to fetch google token");
  
    return res.json();
  
  } catch (error: any) {
    console.error(error, "Failed to fetch google token");
    throw new Error(error.message);
  }

}

export const getGoogleUser = async ({ id_token, access_token }: { id_token: string, access_token: string } ) => {
  try {
     const response = await fetch(
       `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
       {
         method: 'GET',
         headers: {
           Authorization: `Bearer ${id_token}`,
         },
       }
     );
 
    //  if (!response.ok) {
    //    throw new Error(`HTTP error! status: ${response.status}`);
    //  }
 
     const data = await response.json();
     return data;
  } catch (error: any) {
     console.log(error, "Error fetching Google user");
     throw new Error(error.message);
  }
 };
 
 export const findAndUpsertUser = async ( 
  query: FilterQuery<UserDocumentType>, 
  update: UpdateQuery<UserDocumentType>, 
  options: QueryOptions = {}
) => {

  try {
    const user = await UserModel.findOneAndUpdate(query, update, options);
    return user?.toJSON();
    
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }

}
