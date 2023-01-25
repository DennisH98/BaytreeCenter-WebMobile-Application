import express from "express";
import cors from "cors";

import { routes } from "./util/routes";

import * as path from "path";

import * as admin from "firebase-admin";

import cron from "node-cron";
import cronTasks from "./cron_tasks/cronTasks";

import validation from "./endpoints/validation/validation";

import globalEndpointValidationRules from "./endpoints/validation/validationRules";

const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
AdminBro.registerAdapter(AdminBroMongoose);

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT;

const dbUrl: string =
  "mongodb+srv://" +
  process.env.MONGODB_USERNAME +
  ":" +
  process.env.MONGODB_PASSWORD +
  "@cmpt-373-venus.qpjjc.mongodb.net/373-backend?retryWrites=true&w=majority";

const mongoose = require("mongoose");

//Example
const User = mongoose.model("User", {
  name: String,
  email: String,
  surname: String,
});

import { MentorAccount } from "./models/MentorAccount";
import { Mentee } from "./models/Mentee";
import { MentorSchedule } from "./models/MentorSchedule";

const run = async () => {
  await mongoose
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: false })
    .catch((err: any) => {
      console.log(`Couldn't connect to database: ${err}`);
    });

    const AdminBroOptions = {
      resources: [
        User,
        MentorAccount,
        Mentee,
        MentorSchedule,
      ],
      databases: [],
      rootPath: "/admin",
      branding: {
        companyName: "Baytree Centre",
        logo: false,
        softwareBrothers: false,
      },
    };
    const adminBro = new AdminBro(AdminBroOptions);
    const router = AdminBroExpress.buildRouter(adminBro);
  
    app.use(adminBro.options.rootPath, router);
};

run();

app.use(express.json());

app.use(cors());
app.options("*", cors() as any); // enable pre-flight

app.use(validation(globalEndpointValidationRules));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

routes.forEach(({ endpoint, router }) => {
  app.use(`/api/${endpoint}`, router);
});

cronTasks.forEach((cronTask) => {
  cron.schedule(cronTask.cronExpr, cronTask.cronFunc);
});

admin.initializeApp({
  credential: admin.credential.cert(
    path.resolve("baytree-centre-firebase-adminsdk-scrzi-7a2e63837e.json")
  ),
});
