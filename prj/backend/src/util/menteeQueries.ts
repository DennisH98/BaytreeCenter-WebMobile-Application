import { IViewsMentee } from "../../../shared/src/entities/viewsMentee";
import { IMentee, Mentee } from "../models/Mentee";

export async function findMenteeByViewsId(viewsId: string): Promise<IMentee | null> {
  return await Mentee.findOne({ viewsId: viewsId });
}

export function createMentee(viewsMentee: IViewsMentee): IMentee {
  return new Mentee({
    firstName: viewsMentee.firstName,
    lastName: viewsMentee.lastName,
    viewsId: viewsMentee.viewsId,
  });
}
