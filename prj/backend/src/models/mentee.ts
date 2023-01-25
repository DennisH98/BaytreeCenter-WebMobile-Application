import { model, Schema, Model, Document } from "mongoose";

export interface IMentee extends Document {
  firstName: string;
  lastName: string;
  viewsId: string;
  mentorId?: Schema.Types.ObjectId;
}

const MenteeSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  viewsId: { type: String, required: true, unique: true },
  mentorId: { type: Schema.Types.ObjectId, ref: "MentorAccount" }
});

export const Mentee: Model<IMentee> = model("Mentee", MenteeSchema);
