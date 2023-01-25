import express from "express";
import NotificationModel, {
  NotificationDocument,
} from "../models/notification";
import {
  getFilterQueryParameters as getFilterQueryParameters,
  getOptionQueryParameters,
} from "../util/endpoints";
import {
  findDocs,
  getMongooseFilterQueryFromRequestQueryParameters,
  insertDocs,
  updateDocs,
  deleteDocs,
  getMongooseSortOptionsFromRequestQueryParameters,
} from "../util/mongoose";
import validation from "./validation/validation";
import { notificationsRouterValidationRules } from "./validation/validationRules";
import {
  notificationDocumentToNotificationResponse,
  NotificationRequest,
  NotificationResponse,
  objectToNotificationRequest,
} from "../../../shared/src/endpoints/notifications";
import { sendNotifications } from "../cron_tasks/notifications/sendNotifications";

export const notificationsRouter = express.Router();

notificationsRouter.use(validation(notificationsRouterValidationRules));

notificationsRouter.get("/", async (req, res) => {
  try {
    const optionQueryParameters = getOptionQueryParameters(req);

    const filterQueryParameters = getFilterQueryParameters(req);

    const filters =
      getMongooseFilterQueryFromRequestQueryParameters<NotificationDocument>(
        filterQueryParameters
      );

    const sortOptions = getMongooseSortOptionsFromRequestQueryParameters(
      filterQueryParameters
    );

    const notificationDocs: NotificationDocument[] = await findDocs(
      NotificationModel,
      filters,
      sortOptions,
      optionQueryParameters["offset"],
      optionQueryParameters["limit"]
    );

    const notificationDocCount = await NotificationModel.countDocuments(
      filters
    );

    const response: { data: NotificationResponse[]; totalCount: number } = {
      data: notificationDocs.map((notificationDoc) =>
        notificationDocumentToNotificationResponse(notificationDoc)
      ),
      totalCount: notificationDocCount,
    };
    res.send(response);
  } catch (e) {
    res.status(500).send("Can't get notifications.");
  }
});

notificationsRouter.post("/send", async (req, res) => {
  try {
    await sendNotifications();
    res.status(200).send("Success");
  } catch (e) {
    res.status(500).send("Can't send out notifications.");
  }
});

notificationsRouter.post("/", async (req, res) => {
  try {
    const notifications: NotificationRequest[] = req.body.map(
      (object: Record<string, any>) => objectToNotificationRequest(object)
    );

    const result = await insertDocs(NotificationModel, notifications);

    const response: NotificationResponse[] = result.map(
      (notificationDoc: NotificationDocument) =>
        notificationDocumentToNotificationResponse(notificationDoc)
    );

    res.send(response);
  } catch (e) {
    res.status(500).send("Can't post notifications.");
  }
});

notificationsRouter.put("/", async (req, res) => {
  try {
    const notifications: NotificationRequest[] = req.body.map(
      (object: Record<string, any>) => objectToNotificationRequest(object)
    );

    const result = await updateDocs(NotificationModel, notifications);

    const response: NotificationResponse[] = result.map(
      (notificationDoc: NotificationDocument) =>
        notificationDocumentToNotificationResponse(notificationDoc)
    );

    res.send(response);
  } catch (e) {
    res.status(500).send("Can't put notifications.");
  }
});

notificationsRouter.delete("/", async (req, res) => {
  try {
    const ids: string[] = req.body.ids;

    const result = await deleteDocs(NotificationModel, ids);

    res.send("Deleted count: " + result.deletedCount);
  } catch (e) {
    res.status(500).send("Can't delete notifications.");
  }
});
