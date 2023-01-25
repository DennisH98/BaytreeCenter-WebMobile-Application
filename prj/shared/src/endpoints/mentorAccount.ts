import { IExtendedViewsMentor } from "../entities/viewsMentor";
import {
  IDocumentMentorAccount,
  IMentorAccount,
} from "../../../backend/src/models/MentorAccount";

export type MentorAccountIdParams = { accountId: string };
export type MentorAccountCreateRequest = IExtendedViewsMentor;
export type MentorAccountEmailObject = { email: string };
export type MentorAccountResetPasswordRequest = { newPassword: string, token: string };
export type MentorAccountEmailRequest = { email: string };
export type MentorAccountResponse = Omit<
  IMentorAccount & { id?: string },
  "password" | "__v"
>;
export type MentorAccountListResponse = {
  data: MentorAccountResponse[];
  totalCount: number;
};

export type MentorAccountViewsDataEditRequest = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mentorTypes: string[];
};

export type MentorAccountEditRequest = MentorAccountViewsDataEditRequest;

export const mentorAccountDocumentToMentorAccountResponse = (
  mentorAccountDoc: IDocumentMentorAccount
): MentorAccountResponse => {
  return {
    id: mentorAccountDoc._id.toString(),
    firstName: mentorAccountDoc.firstName,
    lastName: mentorAccountDoc.lastName,
    viewsId: mentorAccountDoc.viewsId,
    email: mentorAccountDoc.email,
    username: mentorAccountDoc.username,
    mentorTypes: mentorAccountDoc.mentorTypes,
    mentees: mentorAccountDoc.mentees,
    schedules: mentorAccountDoc.schedules,
    goals: mentorAccountDoc.goals,
    fcmRegistrationTokens: mentorAccountDoc.fcmRegistrationTokens,
  };
};