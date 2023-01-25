import express from "express";

import { EmptyResponse } from "../../../../shared/src/endpoints";
import { SessionsSchedulesListResponse, SessionsScheduleRequest } from "../../../../shared/src/endpoints/schedule";
import { RequestID } from "../../../../shared/src/endpoints/RequestIdType";
import { MentorSchedule } from "../../models/MentorSchedule";
import { MentorAccount } from "../../models/MentorAccount";
import { SessionsSchedule } from "../../../../shared/src/entities/schedule";
import { IViewsMentee } from "../../../../shared/src/entities/viewsMentee";
import { Mentee } from "../../models/Mentee";
import { Date } from "mongoose";

export const mentorSchedulesRouter = express.Router();

mentorSchedulesRouter.get<RequestID, object>("/:id", async (req, res) => {
  
  const viewsMentorID: String = req.params.id.toString()

  try {
    if (viewsMentorID.length == 0) throw Error("No mentor ID given");

    MentorAccount
      .findOne()
      .where('viewsId').equals(viewsMentorID)
      .exec(function (err, mentor) {
        if (err) throw Error(err.message);
        if (mentor == null) throw Error(`No existing mentor account is associated with id ${viewsMentorID}`)
        
        MentorSchedule
          .find()
          .where('mentorDocumentID').equals(mentor._id).populate({ path: 'menteeDocumentID', model: Mentee })
          .exec(function (err, schedules) {
            if (err) throw Error(err.message);
            if (schedules == null) res.status(200).send([]);
            console.log(schedules);
            res.status(200).send(schedules);
          });
    });

  } catch (e) {
    console.error(e);
    res.status(400).send();
  }
});

mentorSchedulesRouter.post<RequestID, EmptyResponse>("/:id", async (req, res) => {
  
  const viewsMentorID: String = req.params.id.toString()
  
  try {
    if (viewsMentorID.length == 0) throw Error("No mentor ID given");

    MentorAccount
      .findOne()
      .where('viewsId').equals(viewsMentorID)
      .exec(async function (err: any, mentor: any) {
        if (err) throw Error(err.message);
        if (mentor == null) throw Error(`No existing mentor account is associated with id ${viewsMentorID}`)
        
        const schedule = new MentorSchedule({
          mentorDocumentID: mentor._id,
          startDate: req.body.startDate,
          menteeDocumentID: req.body.menteeDocumentID
        });

        await MentorAccount.findByIdAndUpdate(mentor._id, {
          $push: { schedules: schedule }
        })

        await schedule.save();

      });

    res.status(201).send({});
  } catch (e) {
    console.error(e)
    res.status(400).send();
  }
});

mentorSchedulesRouter.delete<RequestID, EmptyResponse>("/:id", async (req, res) => {
  
  const scheduleID: String = req.params.id.toString()
  
  try {
    if (scheduleID.length == 0) throw Error("No schedule ID given");

    MentorSchedule
      .findByIdAndRemove(scheduleID, function (err: any, schedule: any) {
        if (err) throw Error(err.message);
        if (schedule == null) throw Error(`No existing schedule is associated with id ${scheduleID}`)
        console.log(`Deleted: ${schedule}`);
      });

    res.status(200).send({});
  } catch (e) {
    console.error(e)
    res.status(400).send();
  }
});

mentorSchedulesRouter.patch<RequestID, EmptyResponse>("/:id", async (req, res) => {
  
  const scheduleID: String = req.params.id.toString()
  
  try {
    if (scheduleID.length == 0) throw Error("No schedule ID given");

    MentorSchedule
      .findByIdAndUpdate(
        scheduleID, 
        {
          "startDate": req.body.startDate,
          "menteeDocumentID": req.body.menteeDocumentID
        },
        function (err: any, schedule: any) {
          if (err) throw Error(err.message);
          console.log(`Updated: ${schedule}`);
        }
      )

    res.status(200).send({});
  } catch (e) {
    console.error(e)
    res.status(400).send();
  }
});