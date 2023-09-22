import mongoose from "mongoose";
import { Request } from "express";


export interface IUser extends mongoose.Document{
    firstName: string;
    lastName: string;
    username:string;
    description: string;
    email: string;
    password: string;
    image: string;
    token: string;
    resetPasswordExpires: number;
    accountType: string;
    recent: [mongoose.Schema.Types.ObjectId];
    progress: [mongoose.Schema.Types.ObjectId];
    createdAt: Date;
    quizes: [mongoose.Schema.Types.ObjectId];
}

export interface IProgress extends mongoose.Document{
    user: mongoose.Schema.Types.ObjectId;
    assignment: mongoose.Schema.Types.ObjectId;
    progress: number;
    createdAt: Date;
}

export interface IAssignment extends mongoose.Document{
    name: string;
    description: string;
    instructions: string[];
    questions: IQuestion[] | any[];
    maxscore : number;
}

export interface IQuestion extends mongoose.Document{
    question: string;
    options: string[];
    image : string;
    answer: string;
    points: number;
}

export interface IQuiz extends mongoose.Document{
    name: string;
    description: string;
    assignment: IAssignment[];
    image: string;
    leaderboard:[mongoose.Schema.Types.ObjectId];
    createdBy: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    verified: boolean;
    language: string;
}

export interface IQuizAttempt extends mongoose.Document{
    quiz: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    totalscore: number;
    createdAt: Date;
}

export interface IOtp extends mongoose.Document{
    email: string;
    otp: string;
    createdAt: Date;
}

export interface AuthReq extends Request {
    user?: any;
    files?: any;
}


