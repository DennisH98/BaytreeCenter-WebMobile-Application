import express from "express";
import axios from "axios";

import { IViewsMentorSessions } from "../../../../shared/src/entities/viewsSessions";
import { parseViewsMentorSessions } from "../../util/views/parser/parseMentorSessionsData";
import { RequestID } from "../../../../shared/src/endpoints/RequestIdType";
import { ViewsMentorSessionsListResponse } from "../../../../shared/src/endpoints/viewsMentorSessions";

const base64 = require("base-64");

export const viewsSessionsRouter = express.Router();

viewsSessionsRouter.get<RequestID, ViewsMentorSessionsListResponse>("/:id", async (req, res) => {
  try {
    const baseUrl: string = "https://app.viewsapp.net/api/restful/contacts/volunteers/" + (req.params.id).toString() + "/sessions?";

    const response = await axios.get(baseUrl, {
      headers: {
        "Authorization": "Basic " + base64.encode(`${process.env.VIEWS_USERNAME}:${process.env.VIEWS_PASSWORD}`),
        "Accept": "application/json",
      }
    });

    let parsedMentorSessions: IViewsMentorSessions[] = parseViewsMentorSessions(response.data);

    res.send(parsedMentorSessions);
  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});
