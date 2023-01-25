import { Request } from "express";
import optionQueryParameters from "../endpoints/queryParameters/optionQueryParameters";
import { isInteger } from "../endpoints/validation/validationFunctions";
import { tryJsonParse } from "./misc";

export const getFilterQueryParameters = (req: Request) => {
  const filterQueryParameters: Record<string, string | string[]> = {};
  for (const queryParam in req.query) {
    if (!optionQueryParameters[queryParam]) {
      const intParam = tryJsonParse(req.query[queryParam]);
      if (isInteger(intParam)) {
        filterQueryParameters[queryParam] = intParam;
      } else {
        filterQueryParameters[queryParam] = req.query[queryParam] as
          | string
          | string[];
      }
    }
  }
  return filterQueryParameters;
};

export const getOptionQueryParameters = (req: Request) => {
  const foundOptionQueryParameters: Record<string, any> = {};

  for (const option in optionQueryParameters) {
    if (req.query[option]) {
      switch (optionQueryParameters[option]) {
        case "number":
          foundOptionQueryParameters[option] = parseInt(
            req.query[option] as string
          );
          break;
        case "string":
          foundOptionQueryParameters[option] = req.query[option];
          break;
      }
    }
  }

  return foundOptionQueryParameters;
};
