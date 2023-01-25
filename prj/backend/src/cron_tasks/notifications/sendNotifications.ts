import { FilterQuery, Types } from "mongoose";
import { MentorAccount } from "../../models/MentorAccount";
import NotificationModel, {
  NotificationDocument,
} from "../../models/notification";
import { createDiscussionForNotification } from "../../util/discussions";
import {
  markNotificationAsSent as markNotificationAsFullySent,
  sendTopicPushNotification,
  sendPushNotificationByMentorTokens,
  markNotificationMentorTypesAsSent,
  markNotificationMentorsAsSent,
  createRecurringNotification,
  stringToAllowedFcmTopicName,
  MentorToken as MentorToken,
  GLOBAL_NOTIFICATION_TOPIC,
} from "../../util/notifications";


export async function sendNotifications() {

  let notifications = await NotificationModel.find(
    notificationsWithSendAtDateBehindCurrentDateAndNotFullySentYet()
  );

  if (notifications.length > 0) {
    for (let notification of notifications) {
      createDiscussionForNotification(notification);

      let globalNotificationSuccessful = true;
      let mentorTypesNotificationsSuccessful = true;
      let mentorsNotificationSuccessful = true;

      if (isGlobalNotification(notification)) {
        globalNotificationSuccessful = await sendTopicPushNotification(
          notification.notificationTitle,
          notification.notificationBody,
          GLOBAL_NOTIFICATION_TOPIC
        );
      } else {
        if (
          notificationHasMentorTypeRecipients(notification) &&
          !notificationMentorTypeRecipientsSent(notification)
        ) {
          for (const mentorType of notification.mentorTypes) {
            if (
              !notification.mentorTypesSuccessfullySentTo.includes(mentorType)
            ) {
              if (mentorType) {
                const topic = stringToAllowedFcmTopicName(mentorType);

                const mentorTypeRecipientsSentSuccessfully =
                  await sendTopicPushNotification(
                    notification.notificationTitle,
                    notification.notificationBody,
                    topic
                  );

                if (mentorTypeRecipientsSentSuccessfully) {
                  notification.mentorTypesSuccessfullySentTo.push(mentorType);
                }

                mentorTypesNotificationsSuccessful =
                  mentorTypesNotificationsSuccessful &&
                  mentorTypeRecipientsSentSuccessfully;
              }
            }
          }

          await NotificationModel.updateOne(
            { _id: notification._id },
            {
              mentorTypesSuccessfullySentTo:
                notification.mentorTypesSuccessfullySentTo,
            }
          );
        }

        if (
          notificationHasMentorRecipients(notification) &&
          !notificationMentorRecipientsSent(notification)
        ) {
          const mentorTokens: MentorToken[] = [];
          for (const mentorObjectId of notification.mentorAccountIds as Types.ObjectId[]) {
            const mentor = await MentorAccount.findById(mentorObjectId._id);
            if (mentor && mentor.fcmRegistrationTokens) {
              for (let token of mentor.fcmRegistrationTokens) {
                mentorTokens.push({mentorAccountId: mentorObjectId._id.toString(), token: token});
              }
            }
          }

          if (mentorTokens.length > 0) {
            mentorsNotificationSuccessful = await sendPushNotificationByMentorTokens(
              mentorTokens,
              notification.notificationTitle,
              notification.notificationBody
            );
          }
        }
      }

      if (
        mentorTypesNotificationsSuccessful &&
        notificationHasMentorTypeRecipients(notification) &&
        !notificationMentorTypeRecipientsSent(notification)
      ) {
        await markNotificationMentorTypesAsSent(notification);
      }

      if (
        mentorsNotificationSuccessful &&
        notificationHasMentorRecipients(notification) &&
        !notificationMentorRecipientsSent(notification)
      ) {
        await markNotificationMentorsAsSent(notification);
      }

      if (
        globalNotificationSuccessful &&
        mentorTypesNotificationsSuccessful &&
        mentorsNotificationSuccessful
      ) {
        await markNotificationAsFullySent(notification);

        if (notification.isRecurringMonthly) {
          await createRecurringNotification(notification);
        }
      }
    }
  }
};

function isGlobalNotification(notification: NotificationDocument) {
  return (
    ((!notification.mentorTypes || notification.mentorTypes.length === 0) &&
      (!notification.mentorAccountIds ||
        notification.mentorAccountIds.length === 0)) ||
    notification.isGlobal
  );
}

function notificationHasMentorTypeRecipients(
  notification: NotificationDocument
) {
  return notification.mentorTypes && notification.mentorTypes.length !== 0;
}

function notificationsWithSendAtDateBehindCurrentDateAndNotFullySentYet(): FilterQuery<NotificationDocument> {
  return {
    $and: [
      {
        $or: [
          {
            sendingAt: {
              $lte: new Date(),
            },
          },
          {
            sendingAt: undefined,
          },
          {
            sendingAt: null,
          },
          {
            sendingAt: { $exists: false },
          },
        ],
      },
      {
        $or: [
          {
            sentAt: undefined,
          },
          {
            sentAt: null,
          },
          {
            sentAt: { $exists: false },
          },
        ],
      },
    ],
  };
}

function notificationHasMentorRecipients(notification: NotificationDocument) {
  return (
    notification.mentorAccountIds && notification.mentorAccountIds.length !== 0
  );
}

function notificationMentorTypeRecipientsSent(
  notification: NotificationDocument
) {
  return (
    notification.mentorTypesSentAt !== undefined &&
    notification.mentorTypesSentAt !== null
  );
}

function notificationMentorRecipientsSent(notification: NotificationDocument) {
  return (
    notification.mentorsSentAt !== undefined &&
    notification.mentorsSentAt !== null
  );
}