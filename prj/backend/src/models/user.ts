import { model, Schema, Model, Document, Types } from "mongoose";

export interface IUser extends Document {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  username: string;
  password: string;
  email: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["superAdmin", "admin"], required: true },
});

const User: Model<IUser> = model("User", UserSchema);

export default User;
