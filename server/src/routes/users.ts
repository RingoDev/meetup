import express from 'express';
import UserModel from '../models/User';
import {User} from "../types/user";

const router = express.Router();

//GETS BACK ALL THE USER/ENTRIES
router.get('/', (_, res) => {
    UserModel.find().then((users:User[]) => {
        res.json(users)
    }).catch((err: any) => res.json({message: err}))

});

export default router;