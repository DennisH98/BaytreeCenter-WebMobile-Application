import express from "express";
import axios from "axios";

import { ViewsMentorListResponse, ViewsMentorResponse } from "../../../../shared/src/endpoints/viewsMentor";
import { IViewsMentor } from "../../../../shared/src/entities/viewsMentor";
import { parseViewsMentors } from "../../util/views/parser/parseMentorsListData";
import { parseSingleMentor } from "../../util/views/parser/parseSingleMentorData";
import { RequestID } from "../../../../shared/src/endpoints/RequestIdType";

const base64 = require("base-64");

export const viewsMentorsRouter = express.Router();

viewsMentorsRouter.get<never, ViewsMentorListResponse>("/", async (req, res) => {
  try {
    const baseUrl: string = "https://app.viewsapp.net/api/restful/contacts/volunteers/search";

    const response = await axios.get(baseUrl, {
      headers: {
        "Authorization": "Basic " + base64.encode(`${process.env.VIEWS_USERNAME}:${process.env.VIEWS_PASSWORD}`),
        "Accept": "application/json",
      }
    });

    let parsedMentors: IViewsMentor[] = parseViewsMentors(response.data);

    res.send(parsedMentors);
  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});

viewsMentorsRouter.get<RequestID, ViewsMentorResponse>("/:id", async (req, res) => {
  try {
    const baseUrl: string = "https://app.viewsapp.net/api/restful/contacts/volunteers/" + (req.params.id).toString();

    const response = await axios.get(baseUrl, {
      headers: {
        "Authorization": "Basic " + base64.encode(`${process.env.VIEWS_USERNAME}:${process.env.VIEWS_PASSWORD}`),
        "Accept": "application/json",
      }
    });

    let parsedMentor: IViewsMentor = parseSingleMentor(response.data);

    res.send(parsedMentor);
  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});
