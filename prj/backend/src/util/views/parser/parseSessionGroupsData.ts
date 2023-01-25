import { IViewsSessionGroups } from "../../../../../shared/src/entities/viewsSessionGroups";
import { IViewsListObject } from "../responseInterface";

export function parseSessionGroups(data: IViewsListObject): IViewsSessionGroups[] {
  let countKey: string = Object.keys(data)[0];
  let sessionGroupsData: Object = data[countKey];
  let parsedSessionGroups: IViewsSessionGroups[] = [];

  for (const [key, sessionGroups] of Object.entries(sessionGroupsData)) {

    let parsedSessionGroup: IViewsSessionGroups = {
        sessionGroupID: parseInt(sessionGroups["SessionGroupID"], 10),
        title: sessionGroups["Title"],
        startDate: new Date(sessionGroups["StartDate"].slice(0, 10)),
        
      };

      parsedSessionGroups.push(parsedSessionGroup);
  }
  
  return parsedSessionGroups;
}
