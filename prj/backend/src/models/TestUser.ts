import { model, Schema, Model, Document } from 'mongoose';

interface ITestUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
}

const TestUserSchema: Schema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export const TestUser: Model<ITestUser> = model('TestUser', TestUserSchema);
