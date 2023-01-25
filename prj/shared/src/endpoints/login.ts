export interface MentorLoginRequest {
  identifier: string;
  password: string;
};

export interface MentorLoginResponse {
  token: string;
  viewsId: string;
  mentorAccountId: string;
};
