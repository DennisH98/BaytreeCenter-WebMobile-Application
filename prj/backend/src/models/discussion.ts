import { model, Schema, Model, Document, Types } from "mongoose";

export interface DiscussionReply {
  authorMentorAccountId: string;
  author: string;
  body: string;
  createdAt: Date;
}

const DiscussionReplySchema: Schema = new Schema({
  authorMentorAccountId: { type: String, required: true },
  author: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, required: true}
});

export interface DiscussionDocument extends Document {
  mentorTypes: string[];
  mentorAccountIds: Types.ObjectId[];
  isGlobal: boolean,
  createdAt: Date;
  title: string;
  body: string;
  replies: DiscussionReply[];
}

const DiscussionSchema: Schema = new Schema({
  mentorTypes: [{ type: String, default: [] }],
  mentorAccountIds: [
    { type: Types.ObjectId, ref: "MentorAccount", default: [] },
  ],
  isGlobal: {type: Boolean, default: false},
  createdAt: Date,
  title: { type: String, required: true },
  body: { type: String, required: true },
  replies: [DiscussionReplySchema],
});

const DiscussionModel: Model<DiscussionDocument> = model(
  "Discussion",
  DiscussionSchema
);

export default DiscussionModel;
