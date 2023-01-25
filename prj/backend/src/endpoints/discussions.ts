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
  discussionDocumentToDiscussionResponse,
  DiscussionRequest,
  DiscussionResponse,
  objectToDiscussionRequest,
} from "../../../shared/src/endpoints/discussions";
import DiscussionModel, {
  DiscussionDocument,
  DiscussionReply,
} from "../models/discussion";
import { EmptyResponse } from "../../../shared/src/endpoints";
import { Types } from "mongoose";

export const discussionsRouter = express.Router();

//discussionsRouter.use(validation(discussionsRouterValidationRules));

discussionsRouter.get("/", async (req, res) => {
  try {
    const optionQueryParameters = getOptionQueryParameters(req);

    const filterQueryParameters = getFilterQueryParameters(req);

    const filters =
      getMongooseFilterQueryFromRequestQueryParameters<DiscussionDocument>(
        filterQueryParameters
      );

    const sortOptions = getMongooseSortOptionsFromRequestQueryParameters(
      filterQueryParameters
    );

    const discusssionDocs: DiscussionDocument[] = await findDocs(
      DiscussionModel,
      filters,
      sortOptions,
      optionQueryParameters["offset"],
      optionQueryParameters["limit"]
    );

    const discussionDocCount = await DiscussionModel.countDocuments(filters);

    const response: { data: DiscussionResponse[]; totalCount: number } = {
      data: discusssionDocs.map((discussionDoc) =>
        discussionDocumentToDiscussionResponse(discussionDoc)
      ),
      totalCount: discussionDocCount,
    };
    res.send(response);
  } catch (e) {
    res.status(500).send("Can't get discussions.");
  }
});

export const post = discussionsRouter.post("/", async (req, res) => {
  try {
    const discussions: DiscussionRequest[] = req.body.map(
      (object: Record<string, any>) => ({
        createdAt: new Date(),
        ...objectToDiscussionRequest(object),
      })
    );

    const result = await insertDocs(DiscussionModel, discussions);

    const response: DiscussionResponse[] = result.map(
      (discussionDoc: DiscussionDocument) =>
        discussionDocumentToDiscussionResponse(discussionDoc)
    );

    res.send(response);
  } catch (e) {
    res.status(500).send("Can't post discussions.");
  }
});

discussionsRouter.post<{ id: number }, EmptyResponse, DiscussionReply>(
  "/addReply/:id",
  async (req, res) => {
    try {
      const response = await DiscussionModel.updateOne(
        {
          _id: new Types.ObjectId(req.params.id),
        },
        {
          $push: { replies: { ...req.body, createdAt: new Date() } },
        }
      );

      res.send(response);
    } catch (e) {
      res.status(500).send("Can't add discussion reply.");
    }
  }
);

discussionsRouter.put("/", async (req, res) => {
  try {
    const discussions: DiscussionRequest[] = req.body.map(
      (object: Record<string, any>) => objectToDiscussionRequest(object)
    );

    const result = await updateDocs(DiscussionModel, discussions);

    const response: DiscussionResponse[] = result.map(
      (notificationDoc: DiscussionDocument) =>
        discussionDocumentToDiscussionResponse(notificationDoc)
    );

    res.send(response);
  } catch (e) {
    res.status(500).send("Can't put discussions.");
  }
});

discussionsRouter.delete("/", async (req, res) => {
  try {
    const ids: string[] = req.body.ids;

    const result = await deleteDocs(DiscussionModel, ids);

    res.send("Deleted count: " + result.deletedCount);
  } catch (e) {
    res.status(500).send("Can't delete discussions.");
  }
});
