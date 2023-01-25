import { EmptyResponse } from "../../shared/src/endpoints";

export const API_URL = "http://localhost:3000/api/";

export enum RequestStatus {
  LOADING,
  LOADED,
  ERROR,
}

const apiFetch = async <RespType = EmptyResponse>(
  endpoint: string,
  urlParams: string = "",
  customInit: RequestInit = {}
): Promise<RespType> => {
  const url = API_URL + endpoint + urlParams;

  const init: RequestInit = {
    ...customInit,
    headers: {
      "Content-Type": "application/json",
      ...customInit.headers,
    },
  };

  const resp = await fetch(url, init);

  if (!resp.ok) {
    return Promise.reject(`API Fetch failed with HTTP Status: ${resp.status}`);
  }

  return resp.json();
};

export const apiGet = async <RespType = EmptyResponse>(
  endpoint: string,
  urlParams: string = "",
  customHeaders?: HeadersInit,
) => {
  return apiFetch<RespType>(endpoint, urlParams, {headers: customHeaders ? customHeaders: null } );
};

export const apiPost = async <RespType = EmptyResponse, ReqType = never>(
  endpoint: string,
  urlParams: string = "",
  body: ReqType,
  customHeaders?: HeadersInit,
  
) => {
  return apiFetch<RespType>(endpoint, urlParams, {
    method: "POST",
    body: JSON.stringify(body),
    headers: customHeaders ? customHeaders : null,
  });
};

export const apiDelete = async (endpoint: string, urlParams: string = "") => {
  return apiFetch(endpoint, urlParams, { method: "DELETE" });
};
