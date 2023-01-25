import { Endpoint } from "../../shared/src/endpoints";
import { generateBackendGetFunc } from "./apiService";
import { MentorTypeResponse } from "../../shared/src/endpoints/mentorTypes";

export const getMentorTypes = generateBackendGetFunc<MentorTypeResponse>(
  Endpoint.MENTOR_TYPES
);
