import express from "express";
import bcrypt from "bcrypt";

const generatePassword = require("password-generator");

import {
  IDocumentMentorAccount,
  MentorAccount,
} from "../../models/MentorAccount";

import { EmptyResponse } from "../../../../shared/src/endpoints";

import {
  MentorAccountCreateRequest,
  MentorAccountListResponse,
  MentorAccountEditRequest,
  MentorAccountIdParams,
  mentorAccountDocumentToMentorAccountResponse,
  MentorAccountResponse,
} from "../../../../shared/src/endpoints/mentorAccount";

import { findMenteeByViewsId, createMentee } from "../../util/menteeQueries";
import { generateUsername } from "../../util/generateUsername";

import { getMailTransporter } from "../../services/mailer";
import { mentorCredentialsTemplate } from "../../util/emailTemplates/mentorCredentials";
import validation from "../validation/validation";
import { mentorAccountsRouterValidationRules } from "../validation/validationRules";
import {
  getOptionQueryParameters,
  getFilterQueryParameters,
} from "../../util/endpoints";
import {
  getMongooseFilterQueryFromRequestQueryParameters,
  getMongooseSortOptionsFromRequestQueryParameters,
  findDocs,
  updateDocs,
} from "../../util/mongoose";
import NotificationModel from "../../models/notification";
import { Types } from "mongoose";
import { IMentee, Mentee } from "../../models/Mentee";
import { RequestID } from "../../../../shared/src/endpoints/RequestIdType";
import { MentorSchedule } from "../../models/MentorSchedule";
import { GLOBAL_NOTIFICATION_TOPIC, registerMentorAccountToMentorTypeNotificationGroups, unregisterMentorAccountFromMentorTypeNotificationGroups } from "../../util/notifications";

export const mentorAccountsRouter = express.Router();

mentorAccountsRouter.use(validation(mentorAccountsRouterValidationRules));

mentorAccountsRouter.get<RequestID>("/:id", async (req, res) => {
  
  const viewsMentorID: String = req.params.id.toString();

  try {
    if (viewsMentorID.length == 0) throw Error("No mentor ID given");

    MentorAccount
      .findOne()
      .where('viewsID').equals(viewsMentorID)
      .populate({ path: 'mentees', model: Mentee })
      .populate({ path: 'schedules', model: MentorSchedule, populate: { path: 'menteeDocumentID', model: Mentee } })
      .exec(function (err, mentorAccount) {
        if (err) throw Error(err.message);
        console.log(mentorAccount);
        res.status(200).send(mentorAccount);
      });

  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});

mentorAccountsRouter.get<never, MentorAccountListResponse>(
  "/",
  async (req, res) => {
    try {
      const optionQueryParameters = getOptionQueryParameters(req);

      const filterQueryParameters = getFilterQueryParameters(req);

      const filters =
        getMongooseFilterQueryFromRequestQueryParameters<IDocumentMentorAccount>(
          filterQueryParameters
        );

      const sortOptions = getMongooseSortOptionsFromRequestQueryParameters(
        filterQueryParameters
      );

      const mentorAccountDocs = await findDocs(
        MentorAccount,
        filters,
        sortOptions,
        optionQueryParameters["offset"],
        optionQueryParameters["limit"],
        ["-password", "-__v"]
      );

      const mentorAccountDocCount = await MentorAccount.countDocuments(filters);

      const response = {
        data: mentorAccountDocs.map((mentorAccountDoc) =>
          mentorAccountDocumentToMentorAccountResponse(mentorAccountDoc)
        ),
        totalCount: mentorAccountDocCount,
      };

      res.send(response);
    } catch (e) {
      console.error(e);
      res.status(400).send();
    }
  }
);

// Create a mentor account
mentorAccountsRouter.post<never, EmptyResponse, MentorAccountCreateRequest>(
  "",
  async (req, res) => {
    try {
      const username: string = await generateUsername(
        req.body.firstName,
        req.body.lastName
      );

      const plainTextPassword: string = generatePassword(12, false);
      const hashedPassword: string = bcrypt.hashSync(plainTextPassword, 10);

      const mentorAccount = new MentorAccount({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        viewsId: req.body.viewsId,
        email: req.body.email,
        username: username,
        password: hashedPassword,
        mentorTypes: req.body.mentorTypes,
      });

      const mentees: IMentee[] = await Promise.all(
        req.body.mentees.map(async (viewsMentee) => {
          const dbMentee = await findMenteeByViewsId(viewsMentee.viewsId);

          if (dbMentee) {
            return dbMentee;
          } else {
            return createMentee(viewsMentee);
          }
        })
      );

      mentorAccount.mentees = mentees.map((mentee) => mentee._id);
      mentees.forEach((mentee) => {
        mentee.mentorId = mentorAccount._id;
      });

      await mentorAccount.save();
      await mentees.forEach(async (mentee) => {
        await mentee.save();
      });

      const mailTransporter = getMailTransporter();

      let mailOptions = {
        from: `"Baytree App" <${process.env.MAILER_EMAIL}>`,
        to: mentorAccount.email,
        subject: "Baytree Account Credentials",
        html: mentorCredentialsTemplate(username, plainTextPassword),
      };

      await mailTransporter.sendMail(mailOptions);

      res.status(200).send({});
    } catch (e) {
      console.error(e);
      res.status(400).send();
    }
  }
);

// Edit a mentor account
mentorAccountsRouter.post<
  MentorAccountIdParams,
  EmptyResponse,
  MentorAccountEditRequest
>("/:accountId", async (req, res) => {
  try {
    let accountId: string = req.params.accountId;
    const mentorAccount = await MentorAccount.findById(accountId);

    if (mentorAccount == null) {
      res.status(404).send();
      return;
    }

    await MentorAccount.updateOne({ _id: accountId }, req.body);

    const updateDoc = req.body;
    if (
      updateDoc.mentorTypes.length !== mentorAccount.mentorTypes.length ||
      !updateDoc.mentorTypes.every((mentorType) => {
        return mentorAccount.mentorTypes.includes(mentorType);
      })
    ) {
      await unregisterMentorAccountFromMentorTypeNotificationGroups(
        mentorAccount.fcmRegistrationTokens,
        mentorAccount.mentorTypes
      );
      await registerMentorAccountToMentorTypeNotificationGroups(
        mentorAccount.fcmRegistrationTokens,
        updateDoc.mentorTypes
      );
    }

    res.status(200).send({});
  } catch (e) {
    console.error(e);
    res.status(400).send();
  }
});

mentorAccountsRouter.put<
  MentorAccountIdParams,
  EmptyResponse,
  MentorAccountEditRequest[]
>("/", async (req, res) => {
  try {

    await updateDocs(MentorAccount, req.body, async (updateDoc, beforeUpdateDoc) => {
      if (updateDoc.mentorTypes || updateDoc.fcmRegistrationTokens) {
        const tokens = updateDoc.fcmRegistrationTokens ?? beforeUpdateDoc.fcmRegistrationTokens;
        const newMentorTypes = updateDoc.mentorTypes ?? beforeUpdateDoc.mentorTypes;
        await unregisterMentorAccountFromMentorTypeNotificationGroups(
          beforeUpdateDoc.fcmRegistrationTokens,
          beforeUpdateDoc.mentorTypes
        );
        await registerMentorAccountToMentorTypeNotificationGroups(
          tokens,
          [GLOBAL_NOTIFICATION_TOPIC, ...newMentorTypes]
        );
      }
    });

    res.status(200).send();
  } catch (e) {
    res.status(500).send("Can't put notifications.");
  }
});

mentorAccountsRouter.delete<MentorAccountIdParams>(
  "/:accountId",
  async (req, res) => {
    try {
      const mentorAccount = await MentorAccount.findByIdAndDelete(req.params.accountId);

      if (mentorAccount) {
        const mentorAccountId = new Types.ObjectId(req.params.accountId);
        await NotificationModel.updateMany(
          { $and: [ { mentorAccountIds: mentorAccountId }, { $or: [{ sentAt: null }, { sentAt: undefined }]}] },
          {
            $pull: { mentorAccountIds: mentorAccountId },
          }
        );
  
        await unregisterMentorAccountFromMentorTypeNotificationGroups(
          mentorAccount.fcmRegistrationTokens,
          [GLOBAL_NOTIFICATION_TOPIC, ...mentorAccount.mentorTypes]
        );
      }

      res.status(200).send({});
    } catch (e) {
      console.error(e);
      res.status(400).send();
    }
  }
);
