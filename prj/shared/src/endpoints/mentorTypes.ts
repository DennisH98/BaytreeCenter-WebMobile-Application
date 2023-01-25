export type MentorTypeResponse = { name: string };

export interface MentorTypeListResponse {
  data: MentorTypeResponse[];
  totalCount: number;
}
