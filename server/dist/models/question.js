"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    question: {
        type: String,
        required: true,
    },
    image: {
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
        enum: [1, 2, 3, 4, 5],
        required: true,
        default: 1,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Question", questionSchema);
