import { Endpoint } from "../../shared/src/endpoints";
import {
  NotificationRequest,
  NotificationResponse,
} from "../../shared/src/endpoints/notifications";

import {
  generateBackendDeleteFunc,
  generateBackendGetFunc,
  generateBackendPostFunc,
  generateBackendPutFunc,
  post,
} from "./apiService";

export const postNotifications = generateBackendPostFunc<
  NotificationRequest,
  NotificationResponse
>(Endpoint.NOTIFICATIONS);

export const putNotifications = generateBackendPutFunc<
  NotificationRequest,
  NotificationResponse
>(Endpoint.NOTIFICATIONS);

export const getNotifications = generateBackendGetFunc<NotificationResponse>(
  Endpoint.NOTIFICATIONS
);

export const deleteNotifications = generateBackendDeleteFunc(
  Endpoint.NOTIFICATIONS
);

export const sendNotifications = async () => {
  try {
    return await post(
      `${process.env.NEXT_PUBLIC_API_HOST}/${Endpoint.NOTIFICATIONS}/send`
    );
  } catch (e) {
    return null;
  }
};
