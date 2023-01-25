import express from "express";
import { FilterQuery } from "mongoose";
import { MentorTypeListResponse } from "../../../shared/src/endpoints/mentorTypes";
import { IDocumentMentorAccount, MentorAccount } from "../models/MentorAccount";
import {
  getFilterQueryParameters as getFilterQueryParameters,
  getOptionQueryParameters,
} from "../util/endpoints";
import {
  findDocs,
  getMongooseFilterQueryFromRequestQueryParameters,
  getMongooseSortOptionsFromRequestQueryParameters,
} from "../util/mongoose";

export const mentorTypesRouter = express.Router();

const buildMentorTypeDocsAggregatePipeline = (
  filters: FilterQuery<IDocumentMentorAccount>,
  sortOptions: any,
  optionQueryParameters: Record<string, any>
) => {
  const mentorTypeDocsAggPipeline: any[] = [];

  mentorTypeDocsAggPipeline.push({ $unwind: "$mentorTypes" });
  mentorTypeDocsAggPipeline.push({ $group: { _id: "$mentorTypes" } });

  if (Object.keys(filters).length > 0)
    mentorTypeDocsAggPipeline.push({ $match: { ...filters } });

  if (Object.keys(sortOptions).length > 0)
    mentorTypeDocsAggPipeline.push({ $sort: { ...sortOptions } });

  mentorTypeDocsAggPipeline.push({ $skip: optionQueryParameters["offset"] });
  mentorTypeDocsAggPipeline.push({ $limit: optionQueryParameters["limit"] });

  return mentorTypeDocsAggPipeline;
};

const buildMentorTypeDocCountAggregatePipeline = (
  filters: FilterQuery<IDocumentMentorAccount>
) => {
  const mentorTypeDocCountAggPipeline: any[] = [];

  mentorTypeDocCountAggPipeline.push({ $unwind: "$mentorTypes" });

  mentorTypeDocCountAggPipeline.push({
    $group: { _id: "$mentorTypes" },
  });

  if (Object.keys(filters).length > 0)
    mentorTypeDocCountAggPipeline.push({ $match: { ...filters } });

  mentorTypeDocCountAggPipeline.push({
    $group: { _id: 0, count: { $sum: 1 } },
  });

  return mentorTypeDocCountAggPipeline;
};

mentorTypesRouter.get("/", async (req, res) => {
  try {
    const optionQueryParameters = getOptionQueryParameters(req);

    const filterQueryParameters = getFilterQueryParameters(req);
    if (filterQueryParameters["sortName"]) {
      filterQueryParameters["sort_id"] = filterQueryParameters["sortName"];
      delete filterQueryParameters["sortName"];
    }
    if (filterQueryParameters["name"]) {
      filterQueryParameters["_id"] = filterQueryParameters["name"];
      delete filterQueryParameters["name"];
    }

    const filters =
      getMongooseFilterQueryFromRequestQueryParameters<IDocumentMentorAccount>(
        filterQueryParameters
      );

    const sortOptions = getMongooseSortOptionsFromRequestQueryParameters(
      filterQueryParameters
    );

    const mentorTypeDocsAggPipeline = buildMentorTypeDocsAggregatePipeline(
      filters,
      sortOptions,
      optionQueryParameters
    );
    const mentorTypeDocs = await MentorAccount.aggregate(
      mentorTypeDocsAggPipeline
    );

    const mentorTypeDocCountAggPipeline =
      buildMentorTypeDocCountAggregatePipeline(filters);
    const mentorTypeDocCount = (
      await MentorAccount.aggregate(mentorTypeDocCountAggPipeline)
    )[0].count;

    const response: MentorTypeListResponse = {
      data: mentorTypeDocs.map((mentorTypeDoc) => ({
        name: mentorTypeDoc._id,
      })),
      totalCount: mentorTypeDocCount,
    };
    res.send(response);
  } catch (e) {
    res.status(500).send("Can't get mentor types.");
  }
});
