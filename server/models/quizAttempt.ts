import mongoose from "mongoose";
import { IQuizAttempt } from "../types";

const quizAttemptSchema = new mongoose.Schema<IQuizAttempt>({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model<IQuizAttempt>("QuizAttempt", quizAttemptSchema);
