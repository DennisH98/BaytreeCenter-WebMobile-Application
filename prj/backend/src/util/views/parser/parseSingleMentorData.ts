import { IViewsMentor } from "../../../../../shared/src/entities/viewsMentor";

export function parseSingleMentor(volunteerObj: any) {
  let mentorTypes: string[] = volunteerObj["Volunteerrole_V_34"].split("|");
  if (mentorTypes.length === 1 && mentorTypes[0] === "") {
    mentorTypes = [];
  }

  let parsedMentor: IViewsMentor = {
    firstName: volunteerObj["Forename"],
    lastName: volunteerObj["Surname"],
    email: volunteerObj["Email"],
    mentorTypes: mentorTypes,
    viewsId: volunteerObj["PersonID"],
    startDate: new Date(volunteerObj["Startdate_V_37"]),
    endDate: new Date(volunteerObj["Enddate_V_38"]),
    dateOfBirth: new Date(volunteerObj["DateOfBirth"]),
    volunteerStatus: volunteerObj["VolunteerStatus_V_1"],
    volunteerStatusNotes: volunteerObj["VolunteerStatusNotes_V_47"],
    age: parseInt(volunteerObj["Age"], 10),
    gender: volunteerObj["Gender"],
    address: volunteerObj["Address1"],
    county:volunteerObj["County"],
    town: volunteerObj["Town"],
    postcode: volunteerObj["Postcode"],
    mobile: volunteerObj["Mobile"],
    ethnicity: volunteerObj["Ethnicity_V_15"],
    firstLanguage: volunteerObj["Whatisyourfirstlanguage_V_19"],
    department: volunteerObj["Department_V_33"],
    volunteerRole: volunteerObj["Volunteerrole_V_34"]
  }

  return parsedMentor;
}