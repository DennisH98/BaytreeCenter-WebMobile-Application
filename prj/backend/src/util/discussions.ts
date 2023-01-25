import DiscussionModel from "../models/discussion";
import { NotificationDocument } from "../models/notification";
import { insertDocs } from "./mongoose";

export async function createDiscussionForNotification(
  notification: NotificationDocument & { _id: any }
) {
  const result = await insertDocs(DiscussionModel, [
    {
      mentorTypes: notification.mentorTypes,
      mentorAccountIds: notification.mentorAccountIds,
      createdAt: new Date(),
      title: notification.notificationTitle,
      body: notification.notificationBody,
      replies: [],
      isGlobal: notification.isGlobal,
    },
  ]);
  return result;
}
