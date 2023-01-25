import { IViewsMentorSessions } from "../../../../../shared/src/entities/viewsSessions";
import { IViewsListObject } from "../responseInterface";

export function parseViewsMentorSessions(data: IViewsListObject): IViewsMentorSessions[] {

  let parsedMentorSessions: IViewsMentorSessions[] = [];

  // Temporary check for empty LIST, not object
  // TODO: Put better check
  if (JSON.stringify(data).length < 10) {
    return parsedMentorSessions;
  }

  let countKey: string = Object.keys(data)[0];
  let sessionsData: Object = data[countKey];

  for (const [key, session] of Object.entries(sessionsData)) {

    let parsedMentorSession: IViewsMentorSessions = {
      sessionID: parseInt(session["SessionID"], 10),
      sessionGroupID: parseInt(session["SessionGroupID"], 10),
      title: session["Title"],
      type: session["Type"],
      startDate: new Date(session["StartDate"].slice(0, 10)),
      duration: session["Duration"],
      participantID: parseInt(session["ParticipantID"]),
      status: session["Status"]
    };

    parsedMentorSessions.push(parsedMentorSession);
  }
  
  return parsedMentorSessions;
}
