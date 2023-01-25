import { IViewsMentee } from "./viewsMentee";

export interface SessionsSchedule {
  scheduleID: string,
  startDate: Date,
  mentee: IViewsMentee
}