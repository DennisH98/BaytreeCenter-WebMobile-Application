import { IViewsMentee } from "./viewsMentee";

export interface IExtendedViewsMentor extends IViewsMentor {
  mentees: IViewsMentee[]
}

export interface IViewsMentor {
  firstName: string,
  lastName: string,
  email: string,
  mentorTypes: string[],
  viewsId: string,
  startDate: Date,
  endDate: Date,
  dateOfBirth: Date,
  volunteerStatus: string,
  volunteerStatusNotes: string,
  age: number,
  gender: string,
  address: string,
  county: string,
  town: string,
  postcode: string,
  mobile: string,
  ethnicity: string,
  firstLanguage: string,
  department: string,
  volunteerRole: string,
}
