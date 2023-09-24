import express, { Router } from "express";

const router : Router = express.Router();

import {
    getAllQuiz,
    getSingleQuiz,
    createQuiz,
    createAssignment,
    createQuestion,
    getCompleteQuiz,
    submitQuiz
} from "../controllers/Quiz"


import {
    auth,
} from "../middleware/auth";

router.get("/getAllQuizes", getAllQuiz);
router.get("/getSingleQuiz/:quizId" ,auth, getSingleQuiz); 
router.get("/getCompleteQuiz/:quizId" ,auth, getCompleteQuiz);
router.post("/createQuiz",auth, createQuiz);
router.post("/createAssignment/:quizId",auth, createAssignment);
router.post("/createQuestion/:assignmentId",auth, createQuestion);
router.post("/submitQuiz/:quizId",auth, submitQuiz);

//router.delete("/deleteQuiz/:quizId",auth, deleteQuiz);

export default router;
