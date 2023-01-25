import { model, Schema, Model, Document, Types } from 'mongoose';

export type IDocumentMentorAccount = IMentorAccount & Document;

export interface IMentorAccount {
  firstName: string;
  lastName: string;
  viewsId: string;
  email: string;
  username: string;
  password: string;
  mentorTypes: string[];
  mentees: Types.ObjectId[];
  schedules: Types.ObjectId[];
  goals: Types.ObjectId[];
  fcmRegistrationTokens: string[]; // the "device IDs" of the mentor to send push notifications to
}

const MentorAccountSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  viewsId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  mentorTypes: { type: [String], required: true },
  mentees: [{ type: Types.ObjectId, ref: "Mentee" }],
  schedules: [{ type: Types.ObjectId, ref: "MentorSchedule" }],
  goals: [{ type: Types.ObjectId, ref: "MentorGoal" }],
  fcmRegistrationTokens: [String]
});

export const MentorAccount: Model<IDocumentMentorAccount> = model('MentorAccount', MentorAccountSchema);
