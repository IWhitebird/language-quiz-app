import mongoose from "mongoose";
import { IQuiz } from "../types";

const quizSchema = new mongoose.Schema<IQuiz>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    assignment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
    }],
    leaderboard: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizAttempt",
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });


export default mongoose.model<IQuiz>("Quiz", quizSchema);