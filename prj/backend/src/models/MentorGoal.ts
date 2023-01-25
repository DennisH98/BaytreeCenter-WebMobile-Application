import { model, Schema, Model, Document } from 'mongoose';

export interface IMentorGoal extends Document {
  mentorDocumentID: Schema.Types.ObjectId;
  menteeDocumentID: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  type: String;
  curr: String;
  end: String;
  description: String;
}

const MentorGoalSchema: Schema = new Schema({
  mentorDocumentID: { type: Schema.Types.ObjectId, ref: 'MentorAccount' },
  menteeDocumentID: { type: Schema.Types.ObjectId, ref: 'Mentee' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  type: { type: String, required: true },
  curr: { type: String, required: true },
  end: { type: String, required: true },
  description: { type: String, required: true },
});

export const MentorGoal: Model<IMentorGoal> = model('MentorGoal', MentorGoalSchema);