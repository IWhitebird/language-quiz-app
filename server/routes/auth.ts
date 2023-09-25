import express, { Router } from "express";

const router : Router = express.Router();

import { 
    register,
    login,
    sendOTP,
    me
 } from "../controllers/Auth";

import {
    auth,
} from "../middleware/auth";


router.post("/register", register);
router.post("/login", login);
router.get('/me' , auth , me);
router.post("/sendOTP", sendOTP);

export default router;
