import express from "express";
import bcrypt from "bcrypt";

const jwt = require("jsonwebtoken");

import { MentorAccount } from "../models/MentorAccount";
import { PasswordResetToken } from "../models/PasswordResetToken";

import { EmptyResponse } from "../../../shared/src/endpoints";
import { MentorAccountEmailObject, MentorAccountResetPasswordRequest } from "../../../shared/src/endpoints/mentorAccount";
import { TokenParams } from "../../../shared/src/endpoints/tokenParams";

import { getMailTransporter } from "../services/mailer";
import { forgotPasswordTemplate } from "../util/emailTemplates/forgotPassword";

export const mentorPasswordResetRouter = express.Router();

mentorPasswordResetRouter.post<never, never, MentorAccountEmailObject>("/email", async (req, res) => {
  try {
    let email: string = req.body.email;

    let mentorAccount = await MentorAccount.findOne({ email: email });

    if (mentorAccount == null) {
      res.status(404).send();
      return;
    }

    const token: string = await jwt.sign(req.body, process.env.JWT_SECRET, { expiresIn: "1h" });

    const passwordResetToken = new PasswordResetToken({
      token: token,
    });

    await passwordResetToken.save();

    const mailTransporter = getMailTransporter();

    let mailOptions = {
      from: `"Baytree App" <${process.env.MAILER_EMAIL}>`,
      to: email,
      subject: "Baytree App Password Reset",
      html: forgotPasswordTemplate(
        mentorAccount.firstName,
        `http://localhost:5000/mentorPasswordReset/${token}`
      ),
    };

    await mailTransporter.sendMail(mailOptions);

    res.status(200).send();
  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});

// Verify a token
mentorPasswordResetRouter.get<TokenParams, EmptyResponse>("/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const storedToken = await PasswordResetToken.findOne({ token: token });

    if (storedToken == null) {
      res.status(404).send();
      return;
    }

    await jwt.verify(storedToken.token, process.env.JWT_SECRET);

    res.status(200).send({});
  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});

// Reset a mentor's password, and delete the token
mentorPasswordResetRouter.post<never, EmptyResponse, MentorAccountResetPasswordRequest>("", async (req, res) => {
  try {
    const token = req.body.token;
    const emailPayload: MentorAccountEmailObject = await jwt.verify(token, process.env.JWT_SECRET);

    const email = emailPayload.email;
    const mentorAccount = MentorAccount.findById(email);

    if (mentorAccount == null) {
      res.status(404).send();
      return;
    }

    const hashedPassword: string = bcrypt.hashSync(req.body.newPassword, 10);
    
    await MentorAccount.updateOne(
      { email: email },
      { password: hashedPassword }
    );

    await PasswordResetToken.findOneAndDelete({ token: token });

    res.status(200).send({});
  } catch(e) {
    console.error(e);
    res.status(400).send();
  }
});
