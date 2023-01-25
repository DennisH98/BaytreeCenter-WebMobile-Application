import express from "express";
import axios from "axios";

import { IViewsAllSessionsFromGroup, IViewsAllSessionsFromGroupData  } from "../../../../shared/src/entities/viewsAllSessionsFromGroup";
import { parseAllSessionsFromGroup } from "../../util/views/parser/parseAllSessionsFromGroupData";
import { RequestID } from "../../../../shared/src/endpoints/RequestIdType";
import { ViewsAllSessionsFromGroupResponse} from "../../../../shared/src/endpoints/viewsAllSessionsFromGroup";

const base64 = require("base-64");

export const viewsAllSessionsFromGroupRouter = express.Router();

viewsAllSessionsFromGroupRouter.get<RequestID, ViewsAllSessionsFromGroupResponse>("/:id", async (req, res) => {
  try {
    const baseUrl: string = "https://app.viewsapp.net/api/restful/work/sessiongroups/"+ (req.params.id).toString() + "/sessions";
    
    const response = await axios.get(baseUrl, {
      headers: {
        "Authorization": "Basic " + base64.encode(`${process.env.VIEWS_USERNAME}:${process.env.VIEWS_PASSWORD}`),
        "Accept": "application/json",
      }
    });
    
    let parsedAllSessionsFromGroup: IViewsAllSessionsFromGroup = parseAllSessionsFromGroup(response.data);

    res.send(parsedAllSessionsFromGroup);
  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});
