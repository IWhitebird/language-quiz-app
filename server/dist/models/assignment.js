"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.assignmentSchema = new mongoose_1.default.Schema({
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
            required: true,
        }
    ],
    questions: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        }],
    maxscore: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Assignment", exports.assignmentSchema);
//# sourceMappingURL=assignment.js.map