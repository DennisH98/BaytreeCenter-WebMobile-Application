import express from "express";
import axios from "axios";

import { ViewsMenteeListResponse } from "../../../shared/src/endpoints/viewsMentee";
import { IViewsMentee } from "../../../shared/src/entities/viewsMentee";
import { parseViewsMentees } from "../util/views/parseMenteeData";

const base64 = require("base-64");

export const viewsMenteesRouter = express.Router();

viewsMenteesRouter.get<never, ViewsMenteeListResponse>("/", async (req, res) => {
  try {
    const baseUrl: string = "https://app.viewsapp.net/api/restful/contacts/participants/search";

    const response = await axios.get(baseUrl, {
      headers: {
        "Authorization": "Basic " + base64.encode(`${process.env.VIEWS_USERNAME}:${process.env.VIEWS_PASSWORD}`),
        "Accept": "application/json",
      }
    });

    let parsedMentees: IViewsMentee[] = parseViewsMentees(response.data);

    res.send(parsedMentees);
  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});
