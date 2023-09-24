import express , {Request, Response , Express} from "express";
import dotenv from "dotenv";
import connect from "./config/database";
import cookieParser from "cookie-parser";
import cors from "cors";
import cloudinaryConnect from "./config/cloudinary";
import fileUpload from "express-fileupload";
dotenv.config();

//Routes
import authRoutes from "./routes/auth";
import quizRoutes from "./routes/quiz";
//

//To Connect to MongoDB Database
connect();
cloudinaryConnect();

const app : Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quiz", quizRoutes);

app.get("/", (req : Request , res : Response) => {
    return res.json({
        success: true,
        message: "Your Server is now running",
    });
});

app.listen(PORT, () => { console.log(`Server is running at ${PORT}`) });