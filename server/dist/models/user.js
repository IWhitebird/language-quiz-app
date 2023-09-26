"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Number,
    },
    accountType: {
        type: String,
        enum: ["admin", "user"],
        required: true,
    },
    quizes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Quiz",
    },
    recent: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "QuizAttempt",
        }],
    progress: [{
            date: {
                type: Date,
                default: Date.now,
            },
            language: {
                type: String,
                required: true,
            },
            score: {
                type: Number,
                required: true,
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", userSchema);
