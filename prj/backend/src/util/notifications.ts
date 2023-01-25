import * as admin from "firebase-admin";
import { MulticastMessage, TopicMessage } from "firebase-admin/lib/messaging/messaging-api";
import { Types } from "mongoose";
import { MentorAccount } from "../models/MentorAccount";
import NotificationModel, {
  NotificationDocument,
} from "../models/notification";
import { insertDocs, updateDocs } from "./mongoose";
import { addMonths } from "./time";

export const GLOBAL_NOTIFICATION_TOPIC = "SENDTOALLMENTORS";

export interface MentorToken {
  mentorAccountId: string;
  token: string;
}

export const sendTopicPushNotification = async (
  title: string,
  body: string,
  topic: string
) => {
  const messaging = admin.messaging();
  const payload :TopicMessage = {
    notification: {
      title: title,
      body: body,
    },
    topic: topic,
  };

  try {
    const result = await messaging.send(payload);
  } catch (e) {
    return false;
  }

  return true;
};

export const sendPushNotificationByMentorTokens = async (
  mentorTokens: MentorToken[],
  title: string,
  body: string
) => {
  const messaging = admin.messaging();
  const payload: MulticastMessage = {
    notification: {
      title: title,
      body: body,
    },
    tokens: mentorTokens.map((mentorToken) => mentorToken.token),
  };

  const batchResponse = await messaging.sendMulticast(payload);
  const responses = batchResponse.responses;

  let expiredMentorTokens: MentorToken[] = [];
  for (let i = responses.length - 1; i >= 0; --i) {
    let response = responses[i];

    if (
      response.error?.code === "messaging/registration-token-not-registered"
    ) {
      expiredMentorTokens.push(mentorTokens[i]);
    }
  }

  if (expiredMentorTokens.length > 0) {
    var uniqueMentorTokenArrays: Record<string, string[]> = {};
    for (let expiredMentorToken of expiredMentorTokens) {
      let mentorTokens =
        uniqueMentorTokenArrays[expiredMentorToken.mentorAccountId];
      if (mentorTokens) {
        mentorTokens.push(expiredMentorToken.token);
      } else {
        uniqueMentorTokenArrays[expiredMentorToken.mentorAccountId] = [
          expiredMentorToken.token,
        ];
      }
    }

    for (let uniqueMentorTokenId in uniqueMentorTokenArrays) {
      await updateDocs(MentorAccount, [
        {
          id: uniqueMentorTokenId,
          $pull: {
            fcmRegistrationTokens: {
              $in: uniqueMentorTokenArrays[uniqueMentorTokenId],
            },
          },
        },
      ]);
    }
  }

  return batchResponse.failureCount - expiredMentorTokens.length === 0;
};

export const stringToAllowedFcmTopicName = (str: string) => {
  return str.replace(/[^a-zA-Z0-9-_.~%]/g, "%");
};

export const registerMentorAccountToMentorTypeNotificationGroups = async (
  fcmRegistrationTokens: string[],
  mentorTypes: string[]
) => {
  if (fcmRegistrationTokens.length > 0) {
    for (let mentorType of mentorTypes) {
      try {
        await admin
          .messaging()
          .subscribeToTopic(
            fcmRegistrationTokens,
            stringToAllowedFcmTopicName(mentorType)
          );
      } catch (e) {
        return false;
      }
    }
  }

  return true;
};

export const unregisterMentorAccountFromMentorTypeNotificationGroups = async (
  fcmRegistrationTokens: string[],
  mentorTypes: string[]
) => {
  if (fcmRegistrationTokens.length > 0) {
    for (let mentorType of mentorTypes) {
      try {
        await admin
          .messaging()
          .unsubscribeFromTopic(
            fcmRegistrationTokens,
            stringToAllowedFcmTopicName(mentorType)
          );
      } catch (e) {
        return false;
      }
    }
  }
  return false;
};

export const markNotificationAsSent = async (
  notification: NotificationDocument
) => {
  await NotificationModel.updateOne(
    { _id: notification._id },
    { sentAt: new Date() }
  );
};

export const markNotificationMentorTypesAsSent = async (
  notification: NotificationDocument
) => {
  await NotificationModel.updateOne(
    { _id: notification._id },
    { mentorTypesSentAt: new Date() }
  );
};

export const markNotificationMentorsAsSent = async (
  notification: NotificationDocument
) => {
  await NotificationModel.updateOne(
    { _id: notification._id },
    { mentorsSentAt: new Date() }
  );
};

export const createRecurringNotification = async (
  notification: NotificationDocument
) => {
  const recurringNotification: Partial<NotificationDocument> = {
    mentorTypes: notification.mentorTypes,
    mentorAccountIds: notification.mentorAccountIds,
    notificationTitle: notification.notificationTitle,
    notificationBody: notification.notificationBody,
    sendingAt: addMonths(notification.sendingAt ?? new Date(), 1),
    mentorTypesSentAt: null,
    mentorsSentAt: null,
    sentAt: null,
    isRecurringMonthly: notification.isRecurringMonthly ?? true,
  };

  if (notification.isRecurringMonthly) {
    await insertDocs(NotificationModel, [recurringNotification]);
  }
};
