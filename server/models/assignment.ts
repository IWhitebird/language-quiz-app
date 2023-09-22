import mongoose from "mongoose";
import { IAssignment } from "../types";

export const assignmentSchema = new mongoose.Schema<IAssignment>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructions: [
        {
            type: String,
            required: false,
        }
    ],
    questions: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    }],
    maxscore: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

export default mongoose.model<IAssignment>("Assignment", assignmentSchema);