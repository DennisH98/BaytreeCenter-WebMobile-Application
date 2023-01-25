import { model, Schema, Model, Document, Types } from "mongoose";

export interface NotificationDocument extends Document {
  isGlobal?: boolean;
  mentorTypes: string[];
  mentorAccountIds: Types.ObjectId[];
  notificationTitle: string;
  notificationBody: string;
  sendingAt?: Date | null;
  mentorTypesSuccessfullySentTo: string[];
  mentorTypesSentAt?: Date | null;
  mentorsSentAt?: Date | null;
  sentAt?: Date | null;
  isRecurringMonthly?: boolean;
}

const NotificationSchema: Schema = new Schema({
  isGlobal: { type: Boolean, default: false },
  mentorTypes: [{ type: String, default: [] }],
  mentorAccountIds: [{ type: Types.ObjectId, ref: "MentorAccount", default: [] }],
  notificationTitle: { type: String, required: true },
  notificationBody: { type: String, required: true },
  sendingAt: Date,
  mentorTypesSuccessfullySentTo: [{ type: String, default: [] },],
  mentorTypesSentAt: Date,
  mentorsSentAt: Date,
  sentAt: Date,
  isRecurringMonthly: { type: Boolean, default: false },
});

const NotificationModel: Model<NotificationDocument> = model(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
