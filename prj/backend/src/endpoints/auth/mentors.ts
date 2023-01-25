import express from "express";
import bcrypt from "bcrypt";

const jwt = require("jsonwebtoken");

import { MentorAccount } from "../../models/MentorAccount";
import { MentorLoginRequest, MentorLoginResponse } from "../../../../shared/src/endpoints/login";

export const mentorAuthRouter = express.Router();

mentorAuthRouter.post<never, MentorLoginResponse, MentorLoginRequest>("/", async (req, res) => {
  try {
    const identifier: string = req.body.identifier;
    const password: string = req.body.password;

    const mentorAccount = await MentorAccount.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ] 
    });

    if (mentorAccount == null) {
      res.status(401).send();
      return;
    }

    const passwordsMatch: boolean = bcrypt.compareSync(password, mentorAccount.password);

    if (passwordsMatch) {
      const username = req.body.identifier;
      const payload = {
        username: username,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res.send({ token: token, viewsId: mentorAccount.viewsId, mentorAccountId: mentorAccount.id });
    } else {
      res.status(401).send();
    }
  } catch (e) {
    console.error(e);
    res.status(400).send();
  }
});
