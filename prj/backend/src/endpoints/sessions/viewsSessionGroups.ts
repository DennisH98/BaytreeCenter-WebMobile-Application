import express from "express";
import axios from "axios";

import { IViewsSessionGroups } from "../../../../shared/src/entities/viewsSessionGroups";
import { parseSessionGroups } from "../../util/views/parser/parseSessionGroupsData";
import { ViewsSessionGroupsListResponse} from "../../../../shared/src/endpoints/viewsSessionGroups";

const base64 = require("base-64");

export const viewsSessionGroupsRouter = express.Router();

viewsSessionGroupsRouter.get<never, ViewsSessionGroupsListResponse>("/", async (req, res) => {
  try {
    const baseUrl: string = "https://app.viewsapp.net/api/restful/work/sessiongroups/search";

    const response = await axios.get(baseUrl, {
      headers: {
        "Authorization": "Basic " + base64.encode(`${process.env.VIEWS_USERNAME}:${process.env.VIEWS_PASSWORD}`),
        "Accept": "application/json",
      }
    });
    
    let parsedSessionGroups: IViewsSessionGroups[] = parseSessionGroups(response.data);

    res.send(parsedSessionGroups);
  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});
