import { IViewsMentor } from "../../../../../shared/src/entities/viewsMentor";
import { parseSingleMentor } from "./parseSingleMentorData";
import { IViewsListObject } from "../responseInterface";

export function parseViewsMentors(data: IViewsListObject): IViewsMentor[] {
  let countKey: string = Object.keys(data)[0];
  let volunteerData: Object = data[countKey];

  let parsedMentors: IViewsMentor[] = [];

  for (const [key, volunteer] of Object.entries(volunteerData)) {

    let parsedMentor: IViewsMentor = parseSingleMentor(volunteer);

    parsedMentors.push(parsedMentor);
  }
  
  return parsedMentors;
}
