import mongoose from "mongoose";
import { UserDocumentType } from "../utils/types";
import bcrypt from 'bcrypt';
import config from 'config';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
})

userSchema.pre('save', async function (next) {
  let user = this as UserDocumentType
  if (!user.isModified('password')) return next()

  const salt = await bcrypt.genSalt(config.get('saltWorkFactor'))
  const hash = bcrypt.hashSync(user.password, salt)
  user.password = hash
  next()

})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocumentType;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
}

const UserModel = mongoose.model<UserDocumentType>('User', userSchema)
export default UserModel;