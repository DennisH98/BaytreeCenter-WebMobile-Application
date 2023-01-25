export type ValidationFunction = (param: any) => boolean;

export const isInteger: ValidationFunction = (param: any) => {
  return typeof param === "number" && Number.isInteger(param);
};

export const isString: ValidationFunction = (param: any) => {
  return typeof param === "string";
};

export const isDate: ValidationFunction = (param: any) => {
  if (typeof param !== "string") {
    return false;
  }

  const match = param.match(
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
  );

  return match !== null && match.length > 0;
};

export const isIntegerArray: ValidationFunction = (param: any) => {
  return Array.isArray(param) && param.every((element) => isInteger(element));
};

export const isStringArray: ValidationFunction = (param: any) => {
  return Array.isArray(param) && param.every((element) => isString(element));
};

export const isEmail: ValidationFunction = (param: any) => {
  if (typeof param !== "string") {
    return false;
  }

  const match = param.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  return match !== null && match.length > 0;
};

export const isBool: ValidationFunction = (param: any) => {
  return typeof param === "boolean";
};

export const isUserName: ValidationFunction = (param: any) => {
  if (typeof param !== "string") {
    return false;
  }

  const match = param.match(/^(?![\_.0-9])[a-zA-Z0-9._]{1,20}$/);

  return match !== null && match.length > 0;
};

export const isPassword: ValidationFunction = (param: any) => {
  if (typeof param !== "string") {
    return false;
  }

  return true; // can check for special characters, length later?
};

export const isNumber: ValidationFunction = (param: any) => {
  return typeof param === "number";
};

const validateLength = (param: any, min: number, max: number) => {
  return (
    (typeof param === "string" && param.length >= min && param.length <= max) ||
    (typeof param === "number" &&
      Number(param).toString().length >= min &&
      Number(param).toString().length <= max)
  );
};

export const length = (min: number, max: number): ValidationFunction => {
  return (param: any) => validateLength(param, min, max);
};

export const isNonNegativeInteger: ValidationFunction = (param: any) => {
  return typeof param === "number" && Number.isInteger(param) && param >= 0;
};

export const isNull: ValidationFunction = (param: any) => {
  return param === null || param === undefined;
};

export const isEmptyString: ValidationFunction = (param: any) => {
  return param === "";
};

export const or: (
  func1: ValidationFunction,
  func2: ValidationFunction
) => ValidationFunction = (func1, func2) => {
  return (param: any) => func1(param) || func2(param);
};

export const generateErrorMessage = (
  param: string,
  violatedValidationFunction: ValidationFunction
) =>
  errorMessages[violatedValidationFunction.name]
    ? errorMessages[violatedValidationFunction.name].replace("{param}", param)
    : "{param}: Unknown violation".replace("param", param);

const errorMessages: Record<string, string> = {
  isInteger: "{param} must be an integer.",
  isString: "{param} must be a string.",
  isDate:
    "{param} must be a valid date of the format: yyyy-MM-ddThh:mm:ss.pppZ",
  isIntegerArray: "{param} must be a valid integer array",
  isStringArray: "{param} must be a valid string array",
  isEmail:
    "{param} must be a valid email of the format: something@something.something",
  isBool:
    "{param} must be a valid boolean value of the format: true, t, y, yes, false, f, n, no",
  isUserName: "{param} must be a valid username.",
  isPassword: "{param} must be a valid password",
  isNumber: "{param} must be a valid number",
  length: "{param} must be of vaild length",
  isNonNegativeInteger: "{param} must be a non-negative integer",
  or: "{param} failed validation",
};
