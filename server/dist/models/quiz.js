"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    assignment: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
        }],
    leaderboard: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "QuizAttempt",
        }],
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    language: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
    time: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Quiz", quizSchema);
//# sourceMappingURL=quiz.js.map