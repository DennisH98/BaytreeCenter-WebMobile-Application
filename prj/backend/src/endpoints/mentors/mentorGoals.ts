import express from "express";

import { EmptyResponse } from "../../../../shared/src/endpoints";
import { RequestID } from "../../../../shared/src/endpoints/RequestIdType";
import { MentorAccount } from "../../models/MentorAccount";
import { MentorGoal } from "../../models/MentorGoal";
import { IViewsMentee } from "../../../../shared/src/entities/viewsMentee";
import { Mentee } from "../../models/Mentee";
import { Date } from "mongoose";

export const mentorGoalsRouter = express.Router();

mentorGoalsRouter.get<RequestID, object>("/:id", async (req, res) => {
  
  const viewsMentorID: String = req.params.id.toString()

  try {
    if (viewsMentorID.length == 0) throw Error("No mentor ID given");

    MentorAccount
      .findOne()
      .where('viewsId').equals(viewsMentorID)
      .exec(function (err, mentor) {
        if (err) throw Error(err.message);
        if (mentor == null) throw Error(`No existing mentor account is associated with id ${viewsMentorID}`)
        
        MentorGoal
          .find()
          .where('mentorDocumentID').equals(mentor._id).populate({ path: 'menteeDocumentID', model: Mentee })
          .exec(function (err, goals) {
            if (err) throw Error(err.message);
            if (goals == null) res.status(200).send([]);
            console.log(goals);
            res.status(200).send(goals);
          });
    });

  } catch (e) {
    console.error(e);
    res.status(400).send();
  }
});

mentorGoalsRouter.post<RequestID, EmptyResponse>("/:id", async (req, res) => {
  
  const viewsMentorID: String = req.params.id.toString()
  
  try {
    if (viewsMentorID.length == 0) throw Error("No mentor ID given");

    MentorAccount
      .findOne()
      .where('viewsId').equals(viewsMentorID)
      .exec(async function (err: any, mentor: any) {
        if (err) throw Error(err.message);
        if (mentor == null) throw Error(`No existing mentor account is associated with id ${viewsMentorID}`)

        const goal = new MentorGoal({
          mentorDocumentID: mentor._id,
          menteeDocumentID: req.body.menteeDocumentID,
          startDate: req.body.startDate,
          endDate: req.body.startDate,
          type: req.body.type,
          curr: req.body.curr,
          end: req.body.end,
          description: req.body.description,
        });

        await goal.save();

      });

    res.status(201).send({});
  } catch (e) {
    console.error(e)
    res.status(400).send();
  }
});

mentorGoalsRouter.delete<RequestID, EmptyResponse>("/:id", async (req, res) => {
  
  const goalID: String = req.params.id.toString()
  
  try {
    if (goalID.length == 0) throw Error("No goal ID given");

    MentorGoal
      .findByIdAndRemove(goalID, function (err: any, goal: any) {
        if (err) throw Error(err.message);
        if (goal == null) throw Error(`No existing goal is associated with id ${goalID}`)
        console.log(`Deleted: ${goal}`);
      });

    res.status(200).send({});
  } catch (e) {
    console.error(e)
    res.status(400).send();
  }
});

mentorGoalsRouter.patch<RequestID, EmptyResponse>("/:id", async (req, res) => {
  
  const goalID: String = req.params.id.toString()
  
  try {
    if (goalID.length == 0) throw Error("No goal ID given");

    MentorGoal
      .findByIdAndUpdate(
        goalID, 
        {
          "endDate": req.body.endDate,
          "type": req.body.type,
          "curr": req.body.curr,
          "end": req.body.end,
          "description": req.body.description,
        },
        function (err: any, goal: any) {
          if (err) throw Error(err.message);
          console.log(`Updated: ${goal}`);
        }
      )

    res.status(200).send({});
  } catch (e) {
    console.error(e)
    res.status(400).send();
  }
});