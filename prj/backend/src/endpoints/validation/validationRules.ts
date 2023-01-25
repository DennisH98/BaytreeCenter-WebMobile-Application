import {
  isInteger,
  isNonNegativeInteger,
  isStringArray,
  ValidationFunction,
  length,
  isEmail,
  isUserName,
  isBool,
  isDate,
  isPassword,
  isString,
} from "./validationFunctions";

export type ValidationRules = Record<string, ValidationFunction[]>;

const globalQueryParamValidationRules: Record<string, ValidationFunction[]> = {
  offset: [isInteger, isNonNegativeInteger],
  limit: [isInteger, isNonNegativeInteger],
};

export const notificationsRouterValidationRules: Record<
  string,
  ValidationFunction[]
> = {
  isGlobal: [isBool],
  notificationTitle: [length(1, 255)],
  sendingAt: [isDate],
  mentorTypesSentAt: [isDate],
  mentorsSentAt: [isDate],
  sentAt: [isDate],
  isRecurringMonthly: [isBool],
  mentorAccountIds: [isStringArray],
  mentorTypes: [isStringArray]
};

export const mentorAccountsRouterValidationRules: Record<
  string,
  ValidationFunction[]
> = {
  firstName: [length(1, 255)],
  lastName: [length(1, 255)],
  viewsId: [isString],
  email: [isEmail],
  username: [isUserName],
  password: [isPassword],
};

export default globalQueryParamValidationRules;
