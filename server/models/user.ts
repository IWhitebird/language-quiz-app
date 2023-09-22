import mongoose from 'mongoose'
import { IUser } from '../types'


const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstName : {
        type: String,
        required: true,
    },
    lastName : {
        type: String,
        required: true,
    },
    description : {
        type: String,
    },
    email :{
        type: String,
        required: true,
        unique: true,
    },
    password :{
        type: String,
        required: true,
    },
    image :{
        type: String,
        required: true,
    },
    token :{
        type: String,
    },
    resetPasswordExpires :{
        type: Number,
    },
    accountType :{
        type: String,
        enum: ["admin", "user"],
        required: true,
    },
    quizes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Quiz",
    },
    recent :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizAttempt",
    }],
    progress :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Progress",
    }],
    createdAt :{
        type: Date,
        default: Date.now,
    },

}, { timestamps: true });


export default mongoose.model<IUser>("User", userSchema);