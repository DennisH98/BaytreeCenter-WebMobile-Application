import { NotificationDocument } from "../../../backend/src/models/notification";

export interface NotificationResponse {
  id: string;
  isGlobal?: boolean;
  mentorTypes: string[];
  mentorAccountIds: string[];
  notificationTitle: string;
  notificationBody: string;
  sendingAt?: Date | null;
  mentorTypesSuccessfullySentTo: string[];
  mentorTypesSentAt?: Date | null;
  mentorsSentAt?: Date | null;
  sentAt?: Date | null;
  isRecurringMonthly?: boolean;
}

export interface NotificationListResponse {
  data: NotificationResponse[];
  totalCount: number;
}

export interface NotificationRequest {
  id?: string;
  isGlobal?: boolean;
  mentorTypes?: string[];
  mentorAccountIds?: string[];
  notificationTitle: string;
  notificationBody: string;
  sendingAt?: Date | null;
  mentorTypesSuccessfullySentTo?: string[];
  mentorTypesSentAt?: Date | null;
  mentorsSentAt?: Date | null;
  sentAt?: Date | null;
  isRecurringMonthly?: boolean;
}

export const notificationDocumentToNotificationResponse = (
  notificationDoc: NotificationDocument
): NotificationResponse => {
  return {
    id: notificationDoc._id.toString(),
    isGlobal: notificationDoc.isGlobal,
    mentorTypes: notificationDoc.mentorTypes,
    mentorAccountIds: notificationDoc.mentorAccountIds.map((mentorAccountId) =>
      mentorAccountId.toString()
    ),
    notificationTitle: notificationDoc.notificationTitle,
    notificationBody: notificationDoc.notificationBody,
    sendingAt: notificationDoc.sendingAt,
    mentorTypesSuccessfullySentTo: notificationDoc.mentorTypesSuccessfullySentTo,
    mentorTypesSentAt: notificationDoc.mentorTypesSentAt,
    mentorsSentAt: notificationDoc.mentorsSentAt,
    sentAt: notificationDoc.sentAt,
    isRecurringMonthly: notificationDoc.isRecurringMonthly,
  };
};

export const objectToNotificationRequest = (
  object: Record<string, any>
): NotificationRequest => {
  return {
    id: object.id,
    isGlobal: object.isGlobal,
    mentorTypes: object.mentorTypes,
    mentorAccountIds: object.mentorAccountIds,
    notificationTitle: object.notificationTitle,
    notificationBody: object.notificationBody,
    sendingAt: object.sendingAt,
    mentorTypesSuccessfullySentTo: object.mentorTypesSuccessfullySentTo,
    mentorTypesSentAt: object.mentorTypesSentAt,
    mentorsSentAt: object.mentorsSentAt,
    sentAt: object.sentAt,
    isRecurringMonthly: object.isRecurringMonthly,
  };
};
