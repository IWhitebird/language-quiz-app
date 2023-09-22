import mongoose from "mongoose";
import { IQuestion } from "../types";

const questionSchema = new mongoose.Schema<IQuestion>({
    question: {
        type: String,
        required: true,
    },
    image : {
        type: String,
        required: false,
    },
    options: [{
        type: String,
        required: true,
    }],
    answer: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        enum : [1,2,3,4,5],
        required: true,
    },
}, { timestamps: true });

export default mongoose.model<IQuestion>("Question", questionSchema);