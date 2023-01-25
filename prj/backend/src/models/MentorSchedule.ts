import { model, Schema, Model, Document } from 'mongoose';

export interface IMentorSchedule extends Document {
  mentorDocumentID: Schema.Types.ObjectId,
  startDate: Date
  menteeDocumentID: Schema.Types.ObjectId
}

const MentorScheduleSchema: Schema = new Schema({
  mentorDocumentID: { type: Schema.Types.ObjectId, ref: 'MentorAccount' },
  startDate: { type: Date, required: true },
  menteeDocumentID: { type: Schema.Types.ObjectId, ref: 'Mentee' }
});

export const MentorSchedule: Model<IMentorSchedule> = model('MentorSchedule', MentorScheduleSchema);