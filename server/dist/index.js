"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = __importDefault(require("./config/cloudinary"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
dotenv_1.default.config();
//Routes
const auth_1 = __importDefault(require("./routes/auth"));
const quiz_1 = __importDefault(require("./routes/quiz"));
//
//To Connect to MongoDB Database
(0, database_1.default)();
(0, cloudinary_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://language-quiz-app.vercel.app"],
    credentials: true,
}));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/quiz", quiz_1.default);
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your Server is now running",
    });
});
app.listen(PORT, () => { console.log(`Server is running at ${PORT}`); });
