import { model, Schema, Model, Document, Types } from 'mongoose';
import  adminRole  from '../../../shared/src/endpoints/adminRoles'
export type IDocumentAdminAccount = IAdminAccount & Document;

export interface IAdminAccount {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  viewsId: string;
  role: number;
}

const AdminAccountSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  viewsId: { type: String, required: true, unique: true },
  role: { type: Number, required: true },
});

export const AdminAccount: Model<IDocumentAdminAccount> = model('AdminAccount', AdminAccountSchema);
