import axios from "axios";
import { sleep } from "../util/misc";

export type Params = Record<
  string,
  number | string | string[] | number[] | boolean | boolean[]
>;

const REQUEST_RETRIES = 3;
const REQUEST_RETRY_DELAY_MS = 1000;

const getRecursive: any = async (
  url: string,
  retries: number,
  params?: Params
) => {
  try {
    const res = await axios.get(url, { params });
    return res.data;
  } catch (e) {
    if (retries === 0 || e.response.status === 400) {
      throw "Failed to get data from API.";
    } else {
      await sleep(REQUEST_RETRY_DELAY_MS);
      return await getRecursive(url, --retries, params);
    }
  }
};

export const get: any = async (url: string, params?: Params) => {
  return await getRecursive(url, REQUEST_RETRIES, params);
};

const postRecursive: any = async (
  url: string,
  retries: number = 3,
  body: Record<string, any>
) => {
  try {
    const res = await axios.post(url, body);
    return res.data;
  } catch (e) {
    if (retries === 0 || e.response.status === 400) {
      throw "Failed to post data to API.";
    } else {
      await sleep(REQUEST_RETRY_DELAY_MS);
      return await postRecursive(url, --retries, body);
    }
  }
};

export const post: any = async (url: string, body?: Record<string, any>) => {
  return await postRecursive(url, REQUEST_RETRIES, body);
};

const putRecursive: any = async (
  url: string,
  retries: number = 3,
  body: Record<string, any>
) => {
  try {
    const res = await axios.put(url, body);
    return res.data;
  } catch (e) {
    if (retries === 0 || e.response.status === 400) {
      throw "Failed to put data to API.";
    } else {
      await sleep(REQUEST_RETRY_DELAY_MS);
      return await putRecursive(url, --retries, body);
    }
  }
};

export const put: any = async (url: string, body?: Record<string, any>) => {
  return await putRecursive(url, REQUEST_RETRIES, body);
};

const delRecursive: any = async (
  url: string,
  retries: number = 3,
  body: Record<string, any>
) => {
  try {
    const res = await axios.delete(url, { data: body });
    return res.data;
  } catch (e) {
    if (retries === 0 || e.response.status === 400) {
      throw "Failed to delete data from API.";
    } else {
      await sleep(REQUEST_RETRY_DELAY_MS);
      return await delRecursive(url, --retries, body);
    }
  }
};

export const del: any = async (url: string, body?: Record<string, any>) => {
  return await delRecursive(url, REQUEST_RETRIES, body);
};

export const generateBackendGetFunc =
  <ResponseType = any>(endpoint: string) =>
  async (
    filters?: Record<string, string | string[]>,
    offset?: number,
    limit?: number
  ): Promise<{ data: ResponseType[]; totalCount: number }> => {
    return await get(`${process.env.NEXT_PUBLIC_API_HOST}/${endpoint}`, {
      ...filters,
      offset,
      limit,
    });
  };

export const generateBackendPostFunc =
  <RequestObjectType = any, ResponseType = any>(endpoint: string) =>
  async (
    requestObjects: RequestObjectType[] | RequestObjectType
  ): Promise<ResponseType[] | null> => {
    if (!Array.isArray(requestObjects)) {
      requestObjects = [requestObjects];
    }

    try {
      return await post(
        `${process.env.NEXT_PUBLIC_API_HOST}/${endpoint}`,
        requestObjects
      );
    } catch (e) {
      return null;
    }
  };

export const generateBackendPutFunc =
  <RequestObjectType = any, ResponseType = any>(endpoint: string) =>
  async (
    requestObjects: RequestObjectType[] | RequestObjectType
  ): Promise<ResponseType[] | null> => {
    if (!Array.isArray(requestObjects)) {
      requestObjects = [requestObjects];
    }

    try {
      return await put(
        `${process.env.NEXT_PUBLIC_API_HOST}/${endpoint}`,
        requestObjects
      );
    } catch (e) {
      return null;
    }
  };

export const generateBackendDeleteFunc =
  <ResponseType = any>(endpoint: string) =>
  async (ids: string[] | string): Promise<ResponseType> => {
    try {
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      return await del(`${process.env.NEXT_PUBLIC_API_HOST}/${endpoint}`, {
        ids,
      });
    } catch (e) {
      return null;
    }
  };
