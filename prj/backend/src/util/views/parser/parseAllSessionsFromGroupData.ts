import { IViewsAllSessionsFromGroup, IViewsAllSessionsFromGroupData } from "../../../../../shared/src/entities/viewsAllSessionsFromGroup";
import { IViewsListObject } from "../responseInterface";


export function parseAllSessionsFromGroup(data: IViewsListObject): IViewsAllSessionsFromGroup {

  let parsedAllSessionDataFromGroup: IViewsAllSessionsFromGroupData[] = [];
  let numberOfSessions=0;

  for (const [key, sessionsGroupData] of Object.entries(data)) {

    let parsedSessionGroup: IViewsAllSessionsFromGroupData = {
        sessionID: parseInt(sessionsGroupData["SessionID"], 10),
        sessionGroupID: parseInt(sessionsGroupData["SessionGroupID"], 10),
        name: sessionsGroupData["Name"],
        startDate: new Date(sessionsGroupData["StartDate"].slice(0, 10)),
        
      };

      parsedAllSessionDataFromGroup.push(parsedSessionGroup);
      numberOfSessions++;
  }

  let parsedAllSessionsFromGroup: IViewsAllSessionsFromGroup = {
      count: numberOfSessions,
      sessionsData: parsedAllSessionDataFromGroup
  }
  
  return parsedAllSessionsFromGroup;
}
