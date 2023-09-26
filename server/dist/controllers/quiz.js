"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.deleteAssignment = exports.deleteQuiz = exports.submitQuiz = exports.publishQuiz = exports.createQuestion = exports.createAssignment = exports.createQuiz = exports.getSingleQuiz = exports.getCompleteQuiz = exports.getAllQuiz = void 0;
const quiz_1 = __importDefault(require("../models/quiz"));
const user_1 = __importDefault(require("../models/user"));
const assignment_1 = __importDefault(require("../models/assignment"));
const question_1 = __importDefault(require("../models/question"));
const quizAttempt_1 = __importDefault(require("../models/quizAttempt"));
const mongoose_1 = __importDefault(require("mongoose"));
const imageUpload_1 = require("../utils/imageUpload");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAllQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quiz = yield quiz_1.default.find({}).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question'
            }
        }).populate({
            path: 'createdBy',
            select: 'username'
        });
        if (!quiz) {
            return res.status(400).json({ success: false, error: 'Quiz not found' });
        }
        return res.status(200).json({
            success: true,
            quiz,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.getAllQuiz = getAllQuiz;
const getCompleteQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        const quiz = yield quiz_1.default.findById(quizId)
            .populate('createdBy')
            .populate('assignment')
            .populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question',
                select: '-answer'
            }
        });
        if (!quiz) {
            return res.status(400).json({ success: false, error: 'Quiz not found' });
        }
        return res.status(200).json({
            success: true,
            quiz,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.getCompleteQuiz = getCompleteQuiz;
const getSingleQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        const quiz = yield quiz_1.default.findById(quizId)
            .populate('createdBy')
            .populate('assignment')
            .populate('assignment')
            .populate({
            path: 'leaderboard',
            populate: {
                path: 'user',
                model: 'User',
                select: 'username , image'
            }
        });
        if (!quiz) {
            return res.status(400).json({ success: false, error: 'Quiz not found' });
        }
        return res.status(200).json({
            success: true,
            quiz,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.getSingleQuiz = getSingleQuiz;
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, language, time, } = req.body;
        const createdBy = req.user.id;
        const thumbnail = req.files.thumbnail;
        if (!name || !description || !language || !time || !thumbnail) {
            return res.status(400).json({ success: false, error: 'Please enter all fields' });
        }
        const user = yield user_1.default.findById(createdBy);
        let verified = false;
        if ((user === null || user === void 0 ? void 0 : user.accountType) == 'admin') {
            verified = true;
        }
        const uploadImg = yield (0, imageUpload_1.UploadToCloudinary)(thumbnail, process.env.FOLDER_NAME);
        const quiz = yield quiz_1.default.create({
            name,
            description,
            createdBy,
            language,
            verified,
            time,
            image: uploadImg.secure_url,
        });
        yield user_1.default.findByIdAndUpdate(createdBy, {
            $push: { quizes: quiz._id }
        });
        return res.status(200).json({
            success: true,
            quiz,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.createQuiz = createQuiz;
const createAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, instructions, } = req.body;
        if (!name || !description || instructions.length === 0) {
            return res.status(400).json({ success: false, error: 'Please enter all fields' });
        }
        const assignment = yield assignment_1.default.create({
            name,
            description,
            instructions: instructions,
        });
        const updatedQuiz = yield quiz_1.default.findByIdAndUpdate(req.params.quizId, { $push: { assignment: assignment._id } }, { new: true }).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question',
            }
        });
        return res.status(200).json({
            success: true,
            quiz: updatedQuiz,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.createAssignment = createAssignment;
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, options, answer, points } = req.body;
        if (!question || !options || !answer || !points) {
            return res.status(400).json({ success: false, error: 'Please enter all fields' });
        }
        const parsedOptions = yield JSON.parse(options);
        const saveQuestion = yield question_1.default.create({
            question,
            options: parsedOptions,
            answer,
            points
        });
        const SaveToAssignment = yield assignment_1.default.findByIdAndUpdate(req.params.assignmentId, {
            $push: { questions: saveQuestion._id },
            $inc: { maxscore: points }
        }, { new: true });
        const quiz = yield quiz_1.default.findById(req.params.quizId).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question',
            }
        });
        return res.status(200).json({
            success: true,
            quiz: quiz,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.createQuestion = createQuestion;
const publishQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        if (!quizId) {
            return res.status(400).json({ success: false, error: 'Please enter all fields' });
        }
        const quiz = yield quiz_1.default.findByIdAndUpdate(quizId, {
            $set: { status: 'published' }
        });
        return res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.publishQuiz = publishQuiz;
const submitQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { answers, timeRemaining } = req.body;
        const { quizId } = req.params;
        if (!answers || !timeRemaining) {
            return res.status(400).json({ success: false, error: 'Please enter all fields' });
        }
        let totalscore = 0;
        let correct = 0;
        for (const key in answers) {
            const question = yield question_1.default.findById(new mongoose_1.default.Types.ObjectId(key));
            if ((question === null || question === void 0 ? void 0 : question.answer) === answers[key].toString()) {
                totalscore += question.points;
                correct++;
            }
        }
        totalscore = Math.floor(totalscore * timeRemaining / 1000);
        let quizAttempt = yield quizAttempt_1.default.create({
            quiz: quizId,
            user: req.user.id,
            totalscore
        });
        const lang = yield quiz_1.default.findById(quizId).select('language');
        const progressPayload = {
            language: lang === null || lang === void 0 ? void 0 : lang.language,
            score: totalscore,
        };
        const updateUser = yield user_1.default.findByIdAndUpdate(req.user.id, {
            $push: {
                recent: quizAttempt._id,
                progress: progressPayload
            }
        }, { new: true });
        const updateQuiz = yield quiz_1.default.findByIdAndUpdate(quizId, {
            $push: { leaderboard: quizAttempt._id }
        }, { new: true });
        res.status(200).json({
            success: true,
            message: 'Quiz submitted successfully',
            quizAttempt,
            correct
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.submitQuiz = submitQuiz;
const deleteQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        const quiz = yield quiz_1.default.findById(quizId);
        if (!quiz) {
            return res.status(400).json({ success: false, error: 'Quiz not found' });
        }
        const assignments = yield assignment_1.default.find({ quiz: quizId });
        for (let assignment of assignments) {
            for (const question of assignment.questions) {
                yield question_1.default.findByIdAndDelete(question);
            }
            assignment_1.default.findByIdAndDelete(assignment._id);
        }
        for (const quizAId of quiz.leaderboard) {
            const quizA = yield quizAttempt_1.default.findById(quizAId);
            yield user_1.default.findByIdAndUpdate(quizA === null || quizA === void 0 ? void 0 : quizA.user, {
                $pull: { recent: quizA === null || quizA === void 0 ? void 0 : quizA._id }
            });
            yield quizAttempt_1.default.findByIdAndDelete(quizA === null || quizA === void 0 ? void 0 : quizA._id);
        }
        const user = yield user_1.default.findByIdAndUpdate(quiz.createdBy, {
            $pull: { quizes: quiz._id }
        });
        yield quiz_1.default.findByIdAndDelete(quizId);
        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully',
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.deleteQuiz = deleteQuiz;
const deleteAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.params.quizId;
        const assignId = req.params.assignId;
        const assignment = yield assignment_1.default.findById(assignId);
        if ((assignment === null || assignment === void 0 ? void 0 : assignment.questions) !== undefined) {
            for (let question of assignment === null || assignment === void 0 ? void 0 : assignment.questions) {
                yield question_1.default.findByIdAndDelete(question);
            }
        }
        yield assignment_1.default.findByIdAndDelete(assignId);
        const updateQuid = yield quiz_1.default.findByIdAndUpdate(quizId, {
            $pull: { assignment: assignId }
        }, { new: true }).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question',
            }
        });
        ;
        res.status(200).json({
            success: true,
            message: 'Assignment deleted successfully',
            quiz: updateQuid,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.deleteAssignment = deleteAssignment;
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.params.quizId;
        const assignId = req.params.assignId;
        const quesId = req.params.quesId;
        yield assignment_1.default.findByIdAndUpdate(assignId, { $pull: { questions: quesId } }, { new: true });
        yield question_1.default.findByIdAndDelete(quesId);
        const updateQuid = yield quiz_1.default.findById(quizId).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question',
            }
        });
        res.status(200).json({
            success: true,
            message: 'Question deleted successfully',
            quiz: updateQuid,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
});
exports.deleteQuestion = deleteQuestion;
//# sourceMappingURL=quiz.js.map