import { FilterQuery, Model, QueryOptions } from "mongoose";
import { tryJsonParse } from "./misc";

const containsWordsToConditions = (
  queryParam: string,
  queryParamValue: string
) => {
  return [
    ...(queryParamValue as string).split(" ").map((token) => ({
      [queryParam]: { $regex: token, $options: "i" },
    })),
  ].filter((condition) => condition[queryParam].$regex !== "");
};

export const equalQueryParamToConditions = (
  queryParams: Record<string, string | string[]>,
  queryParam: string
) => {
  if (Array.isArray(queryParams[queryParam])) {
    const queryParamValues: any[] = [];
    (queryParams[queryParam] as string[]).forEach((queryParamValue) =>
      queryParam === "id"
        ? queryParamValues.push({ _id: queryParamValue })
        : queryParamValues.push({
            $and: containsWordsToConditions(queryParam, queryParamValue),
          })
    );
    return { $or: queryParamValues };
  } else {
    return queryParam === "id"
      ? { _id: queryParams[queryParam] }
      : {
          $and:
            typeof queryParams[queryParam] === "boolean"
              ? [{ [queryParam]: queryParams[queryParam] }]
              : containsWordsToConditions(
                  queryParam,
                  queryParams[queryParam] as string
                ),
        };
  }
};

export const includesQueryParamToConditions = (
  queryParam: string,
  queryParams: Record<string, string | string[]>
) => {
  const queryParamWithoutSuffix = queryParam.replace("IncludesAny", "");
  let value = queryParams[queryParam];
  if (!Array.isArray(value)) {
    value = [value];
  }
  return {
    [queryParamWithoutSuffix]: { $in: value },
  };
};

const queryParamToConditions = (
  queryParam: string,
  queryParams: Record<string, string | string[]>
) => {
  if (!queryParam.startsWith("sort") && !queryParam.endsWith("IncludesAny")) {
    return equalQueryParamToConditions(queryParams, queryParam);
  } else if (queryParam.endsWith("IncludesAny")) {
    return includesQueryParamToConditions(queryParam, queryParams);
  }
};

const parseArrayOrQueryParams = (or: string) => {
  const filters = or.split("@@@");
  const queryParams = filters.map((filter) => {
    const filterSplit = filter.split("=");
    return [filterSplit[0], filterSplit[1]];
  });

  const arrayOrQueryParams: Record<string, string[]> = {};
  for (const queryParam of queryParams) {
    if (queryParam[0].includes("[]")) {
      const key = queryParam[0].replace("[]", "");
      const newValue = arrayOrQueryParams[key] ?? [];
      const val = tryJsonParse(queryParam[1]);
      arrayOrQueryParams[key] = [val, ...newValue];
    }
  }

  return arrayOrQueryParams;
};

const parseNonArrayOrQueryParams = (or: string) => {
  const filters = or.split("@@@");
  const queryParams = filters.map((filter) => {
    const filterSplit = filter.split("=");
    return [filterSplit[0], filterSplit[1]];
  });

  const nonArrayOrQueryParams: Record<string, any> = {};
  for (const queryParam of queryParams) {
    if (!queryParam[0].includes("[]")) {
      const val = tryJsonParse(queryParam[1]);
      nonArrayOrQueryParams[queryParam[0]] = val;
    }
  }

  return nonArrayOrQueryParams;
};

const parseOrQueryParams = (or: string) => {
  const arrayOrQueryParams = parseArrayOrQueryParams(or);
  const nonArrayOrQueryParams = parseNonArrayOrQueryParams(or);
  return { ...arrayOrQueryParams, ...nonArrayOrQueryParams };
};

export const getMongooseFilterQueryFromRequestQueryParameters = <Document>(
  queryParams: Record<string, string | string[]>
): FilterQuery<Document> => {
  const andConditions: object[] = [];
  for (const queryParam in queryParams) {
    if (queryParam === "or") {
      const orConditions: object[] = [];
      const orQueryParams = parseOrQueryParams(
        queryParams[queryParam] as string
      );
      for (const orQueryParam in orQueryParams) {
        const orQueryParamConditions = queryParamToConditions(
          orQueryParam,
          orQueryParams
        );
        if (orQueryParamConditions) {
          orConditions.push(orQueryParamConditions);
        }
      }
      andConditions.push({ $or: orConditions });
    } else {
      const queryParamConditions = queryParamToConditions(
        queryParam,
        queryParams
      );
      if (queryParamConditions) {
        andConditions.push(queryParamConditions);
      }
    }
  }

  return (
    andConditions.length > 0 ? { $and: andConditions } : {}
  ) as FilterQuery<Document>;
};

export const updateDocs = async (
  model: Model<any>,
  updateDocs: Record<string, any>[],
  asyncUpdateDocCallback?: (
    updateDoc: Record<string, any>,
    beforeUpdateDoc: Record<string, any>
  ) => void
): Promise<any[]> => {
  try {
    const originalDocs: Record<string, any>[] = [];
    for (const updateDoc of updateDocs) {
      const beforeUpdateDoc = await model.findByIdAndUpdate(
        updateDoc.id,
        updateDoc
      );

      if (asyncUpdateDocCallback) {
        await asyncUpdateDocCallback(updateDoc, beforeUpdateDoc);
      }

      originalDocs.push(beforeUpdateDoc);
    }

    return originalDocs;
  } catch (e) {
    throw "Failed to insert docs";
  }
};

export const findDocs = async (
  model: Model<any>,
  filterQuery: FilterQuery<any>,
  sortOptions: QueryOptions["sort"],
  offset: number | undefined,
  limit: number | undefined,
  select?: string[],
  distinctField?: string
) => {
  const findQueryOptions = { skip: offset, limit: limit, sort: sortOptions };

  let query = model.find(filterQuery, {}, findQueryOptions);
  query = select ? query.select(select) : query;
  query = distinctField ? query.distinct(distinctField) : query;

  const resultDocs = await query;

  return resultDocs;
};

export const deleteDocs = async (model: Model<any>, ids: string[]) => {
  if (!ids || ids.length === 0) {
    throw "Failed to delete docs; must supply ids";
  }
  try {
    const result = await model.deleteMany({ _id: { $in: ids } });

    return result;
  } catch (e) {
    throw "Failed to delete docs";
  }
};

export const getMongooseSortOptionsFromRequestQueryParameters = (
  queryParams: Record<string, string | string[]>
): QueryOptions["sort"] => {
  const sortQueryOptions: QueryOptions["sort"] = {};

  for (const queryParam in queryParams) {
    if (queryParam.startsWith("sort")) {
      const removeSortPrefix = queryParam.replace("sort", "");
      sortQueryOptions[
        removeSortPrefix.substr(0, 1).toLowerCase() + removeSortPrefix.substr(1)
      ] = queryParams[queryParam];
    }
  }

  return sortQueryOptions;
};

export const hasMoreDocs = async (
  model: Model<any>,
  offset: number | undefined,
  limit: number | undefined
) => {
  const docsCount = await model.countDocuments({});
  const hasMore = limit
    ? offset
      ? offset + limit < docsCount
      : limit < docsCount
    : false;
  return hasMore;
};

export const insertDocs = async (
  model: Model<any>,
  docs: Record<string, any>[]
): Promise<any[]> => {
  try {
    return await model.insertMany(docs);
  } catch (e) {
    throw "Failed to insert docs";
  }
};
