import { Request, Response, NextFunction } from "express";
import { getOptionQueryParameters } from "../../util/endpoints";
import { parseQueryParams } from "../queryParameters/queryParamParser";
import {
  generateErrorMessage,
  ValidationFunction,
} from "./validationFunctions";
import { ValidationRules } from "./validationRules";

const getViolatedValidationFunction = (
  param: string,
  value: any,
  validationRules: ValidationRules
): ValidationFunction | null => {
  if (validationRules[param]) {
    const violatedValidationFunction = validationRules[param].find(
      (validationFunction) => !validationFunction(value)
    );

    if (violatedValidationFunction) {
      return violatedValidationFunction;
    }
  }

  return null;
};

interface ViolatedFieldAndFunction {
  field: string;
  func: ValidationFunction;
}

const validateObject = (
  object: Record<string, any>,
  validationRules: ValidationRules
): ViolatedFieldAndFunction | null => {
  for (const field in object) {
    const violatedValidationFunction = getViolatedValidationFunction(
      field,
      object[field],
      validationRules
    );

    if (violatedValidationFunction) {
      return { field: field, func: violatedValidationFunction };
    }
  }

  return null;
};

const respondWithError = (
  res: Response,
  param: string,
  func: ValidationFunction
) => {
  res.status(400).send(generateErrorMessage(param, func));
};

const doValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
  validationRules: ValidationRules
) => {
  if (req.method === "GET") {
    const parsedQueryParams = parseQueryParams(getOptionQueryParameters(req));

    const violatedValidationField = validateObject(
      parsedQueryParams,
      validationRules
    );

    if (violatedValidationField) {
      respondWithError(
        res,
        violatedValidationField.field,
        violatedValidationField.func
      );
      return;
    }
  } else if (req.method === "PUT" || req.method === "POST") {
    const objectsArray: Record<string, any>[] = Array.isArray(req.body)
      ? req.body
      : [req.body];
    for (const object of objectsArray) {
      const violatedValidationField = validateObject(object, validationRules);

      if (violatedValidationField) {
        respondWithError(
          res,
          violatedValidationField.field,
          violatedValidationField.func
        );

        return;
      }
    }
  }

  next();
};

const validation = (validationRules: ValidationRules) => {
  return (req: Request, res: Response, next: NextFunction) =>
    doValidation(req, res, next, validationRules);
};

export default validation;
