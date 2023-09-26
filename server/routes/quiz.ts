import express, { Router } from "express";

const router : Router = express.Router();

import {
    getAllQuiz,
    getSingleQuiz,
    createQuiz,
    createAssignment,
    createQuestion,
    getCompleteQuiz,
    submitQuiz,
    deleteQuiz,
    deleteAssignment,
    deleteQuestion,
    publishQuiz
} from "../controllers/quiz"


import {
    auth,
} from "../middleware/auth";

router.get("/getAllQuizes", getAllQuiz);
router.get("/getSingleQuiz/:quizId" ,auth, getSingleQuiz); 
router.get("/getCompleteQuiz/:quizId" ,auth, getCompleteQuiz);

router.post("/createQuiz",auth, createQuiz);
router.post("/createAssignment/:quizId",auth, createAssignment);
router.post("/createQuestion/:quizId/:assignmentId",auth, createQuestion);
router.post("/submitQuiz/:quizId",auth, submitQuiz);
router.post("/publish/:quizId",auth,  publishQuiz)

router.delete("/deleteQuiz/:quizId",auth, deleteQuiz);
router.delete("/deleteAssignment/:quizId/:assignId",auth, deleteAssignment);
router.delete("/deleteQuestion/:quizId/:assignId/:quesId",auth, deleteQuestion);

export default router;
