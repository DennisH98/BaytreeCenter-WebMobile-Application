import { MentorAccountResponse } from "../../shared/src/endpoints/mentorAccount";
import { Endpoint } from "../../shared/src/endpoints";
import { generateBackendGetFunc } from "./apiService";

export const getMentorAccounts = generateBackendGetFunc<MentorAccountResponse>(
  Endpoint.MENTOR_ACCOUNTS
);
