import express from "express";
import UserModel from "../models/User";

const router = express.Router();

//GETS BACK ALL THE USER/ENTRIES
router.get("/", (_, res) => {
  UserModel.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err: any) => res.json({ message: err }));
});

export default router;
