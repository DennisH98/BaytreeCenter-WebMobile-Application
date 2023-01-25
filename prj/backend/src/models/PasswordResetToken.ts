import { model, Schema, Model, Document } from "mongoose";

interface IPasswordResetToken extends Document {
  token: string;
}

const PasswordResetTokenSchema: Schema = new Schema({
  token: { type: String, required: true },
});

export const PasswordResetToken: Model<IPasswordResetToken> = model("PasswordResetToken", PasswordResetTokenSchema);
