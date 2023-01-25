import { TestUser } from "../models/TestUser";
import express from "express";

export const testRouter = express.Router();

testRouter.get("/add", async (req, res) => {
  try {
    const testUser = new TestUser({
      email: 'test@example.com',
      firstName: 'test',
      lastName: 'user',
    });

    await testUser.save();

    res.send(testUser);
  } catch (e) {
    console.error(e);
    res.status(400).send();
  }
});

testRouter.get("", async (req, res) => {
  try {
    const testUsers = await TestUser.find();

    res.send(testUsers);
  } catch (e) {
    console.error(e);
    res.status(400).send();
  }
});
