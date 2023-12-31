"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const quiz_1 = require("../controllers/quiz");
const auth_1 = require("../middleware/auth");
router.get("/getAllQuizes", quiz_1.getAllQuiz);
router.get("/getSingleQuiz/:quizId", auth_1.auth, quiz_1.getSingleQuiz);
router.get("/getCompleteQuiz/:quizId", auth_1.auth, quiz_1.getCompleteQuiz);
router.post("/createQuiz", auth_1.auth, quiz_1.createQuiz);
router.post("/createAssignment/:quizId", auth_1.auth, quiz_1.createAssignment);
router.post("/createQuestion/:quizId/:assignmentId", auth_1.auth, quiz_1.createQuestion);
router.post("/submitQuiz/:quizId", auth_1.auth, quiz_1.submitQuiz);
router.post("/publish/:quizId", auth_1.auth, quiz_1.publishQuiz);
router.delete("/deleteQuiz/:quizId", auth_1.auth, quiz_1.deleteQuiz);
router.delete("/deleteAssignment/:quizId/:assignId", auth_1.auth, quiz_1.deleteAssignment);
router.delete("/deleteQuestion/:quizId/:assignId/:quesId", auth_1.auth, quiz_1.deleteQuestion);
exports.default = router;
//# sourceMappingURL=quiz.js.map