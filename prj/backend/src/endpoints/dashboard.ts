import { TestUser } from "../models/TestUser";
import express from "express";

export const dashboardRouter = express.Router();

const object = {
  "4": {
    "next_session": {
      "sessionGroupId": "3",
      "sessionType": "Individual (sessionType)",
      "name": "Mentor session",
      "startDate": "2021-11-25",
      "startTime": "14:00",
      "duration": "01:00",
      "leadStaff": "53",
      "venueId": "2",
      "Individual": "Individual (contactType)"
    },
    "goals": {
      "progress": {
        "1": {
          "name": "practice algebra questions",
          "curr": "3",
          "end": "7"
        },
        "2": {
          "name": "speak fluent english",
          "curr": "62",
          "end": "100"
        }
      },
      "bool": {
        "1": {
          "name": "friendly towards others",
          "curr": "false"
        },
        "2": {
          "name": "polite to everyone",
          "curr": "true"
        }
      }
    }
  },
  "9": {
    "next_session": {
      "sessionGroupId": "3",
      "sessionType": "Individual (sessionType)",
      "name": "Mentor session",
      "startDate": "2021-11-30",
      "startTime": "12:30",
      "duration": "01:00",
      "leadStaff": "53",
      "venueId": "2",
      "Individual": "Individual (contactType)"
    },
    "goals": {
      "progress": {
        "1": {
          "name": "practice algebra questions",
          "curr": "6",
          "end": "7"
        },
        "2": {
          "name": "speak fluent english",
          "curr": "15",
          "end": "100"
        }
      },
      "bool": {
        "1": {
          "name": "friendly towards others",
          "curr": "false"
        },
        "2": {
          "name": "polite to everyone",
          "curr": "false"
        }
      }
    }
  },
  "mentee_ids": [
    "4",
    "9"
  ]
}

dashboardRouter.get("", async (req, res) => {
    res.send(object);
});
