import { tryJsonParse } from "../../util/misc";

export const parseQueryParams = (
  queryParams: Record<string, string | string[]>
): Record<string, any> => {
  const parsedQueryParams: Record<string, any> = {};

  for (const queryParam in queryParams) {
    if (Array.isArray(queryParams[queryParam])) {
      parsedQueryParams[queryParam] = (queryParams[queryParam] as string[]).map(
        (val) => tryJsonParse(val)
      );
    } else {
      parsedQueryParams[queryParam] = tryJsonParse(
        queryParams[queryParam] as string
      );
    }
  }

  return parsedQueryParams;
};
