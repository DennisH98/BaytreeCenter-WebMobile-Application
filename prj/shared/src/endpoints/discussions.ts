import {
  DiscussionDocument,
  DiscussionReply,
} from "../../../backend/src/models/discussion";

export interface DiscussionResponse {
  id: string;
  mentorTypes: string[];
  mentorAccountIds: string[];
  isGlobal: boolean;
  createdAt: Date;
  title: string;
  body: string;
  replies: DiscussionReply[];
}

export interface DiscussionListResponse {
  data: DiscussionResponse[];
  totalCount: number;
}

export interface DiscussionRequest {
  id?: string;
  mentorTypes?: string[];
  mentorAccountIds?: string[];
  isGlobal?: boolean;
  createdAt?: Date;
  title?: string;
  body?: string;
  replies?: DiscussionReply[];
}

export const discussionDocumentToDiscussionResponse = (
  discussionDoc: DiscussionDocument
): DiscussionResponse => {
  return {
    id: discussionDoc._id.toString(),
    mentorTypes: discussionDoc.mentorTypes,
    mentorAccountIds: discussionDoc.mentorAccountIds.map((mentorAccountId) =>
      mentorAccountId.toString()
    ),
    isGlobal: discussionDoc.isGlobal,
    title: discussionDoc.title,
    body: discussionDoc.body,
    replies: discussionDoc.replies,
    createdAt: discussionDoc.createdAt,
  };
};

export const objectToDiscussionRequest = (
  object: Record<string, any>
): DiscussionRequest => {
  return {
    id: object.id,
    mentorTypes: object.mentorTypes,
    mentorAccountIds: object.mentorAccountIds,
    isGlobal: object.isGlobal,
    title: object.title,
    createdAt: object.createdAt,
    body: object.body,
    replies: object.replies,
  };
};
