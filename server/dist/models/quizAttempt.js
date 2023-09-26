"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizAttemptSchema = new mongoose_1.default.Schema({
    quiz: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    totalscore: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("QuizAttempt", quizAttemptSchema);
//# sourceMappingURL=quizAttempt.js.map