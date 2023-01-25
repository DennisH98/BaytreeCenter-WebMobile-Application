import { IViewsMentee } from "../../../../shared/src/entities/viewsMentee";
import { IViewsListObject } from "../views/responseInterface";

export function parseViewsMentees(data: IViewsListObject): IViewsMentee[] {
  let countKey: string = Object.keys(data)[0];
  let participantData: Object = data[countKey];

  let parsedMentees: IViewsMentee[] = [];

  for (const [_, participant] of Object.entries(participantData)) {
    let parsedMentee: IViewsMentee = {
      firstName: participant["Forename"],
      lastName: participant["Surname"],
      viewsId: participant["PersonID"],
    };

    parsedMentees.push(parsedMentee);
  }
  
  return parsedMentees;
}