import express, { Router } from "express";

const router : Router = express.Router();

import { 
    register,
    login,
    sendOTP
 } from "../controllers/Auth";

import {
    auth,
    isAdmin,
} from "../middleware/auth";

router.post("/register", register);
router.post("/login", login);
router.post("/sendOTP", sendOTP);

export default router;
