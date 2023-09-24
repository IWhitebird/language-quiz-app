import  {Request , Response} from 'express';
import  Quiz  from '../models/quiz';
import  User  from '../models/user';
import Assignment from '../models/assignment';
import Question from '../models/question';
import QuizAttempt from "../models/quizAttempt";
import { AuthReq, IQuestion } from '../types';
import mongoose from 'mongoose';
import { UploadToCloudinary } from '../utils/imageUpload';

import dotenv from 'dotenv';
import { combineReducers } from 'redux';
dotenv.config();

export const getAllQuiz = async (req: Request, res: Response) => {
    try {
        const quiz = await Quiz.find({}).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question'
            }
        }).populate({
            path: 'createdBy',
            select: 'username'
        });

        if(!quiz){
            return res.status(400).json({success : false , error: 'Quiz not found' });
        }

        return res.status(200).json({
            success: true,
            quiz,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
};

export const getCompleteQuiz = async (req: Request, res: Response) => {
try{
    const {quizId} = req.params;

    const quiz = await Quiz.findById(quizId)
    .populate('createdBy')
    .populate('assignment')
    .populate({
        path: 'assignment',
        populate: {
            path: 'questions',
            model: 'Question',
            select: '-answer'
        }
    });

    if(!quiz){
        return res.status(400).json({success : false , error: 'Quiz not found' });
    }

    return res.status(200).json({
        success: true,
        quiz,
    });

} catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: 'Internal Server error',
    });
  }
};

export const getSingleQuiz = async (req: Request, res: Response) => {
    try {
        const {quizId} = req.params;

        const quiz = await Quiz.findById(quizId)
        .populate('createdBy')
        .populate('assignment')
        .populate('assignment')
        .populate({
            path: 'leaderboard',
            populate: {
                path: 'user',
                model: 'User',
                select: 'username , image'

            }
        });

        if(!quiz){
            return res.status(400).json({success : false , error: 'Quiz not found' });
        }

        return res.status(200).json({
            success: true,
            quiz,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
};

export const createQuiz = async (req: AuthReq, res: Response) => {
    try{
        const {
            name,
            description,
            language,
        } = req.body;

        const createdBy = req.user.id;

        const thumbnail = req.files.thumbnail;
        
        if(!name || !description || !language){
            return res.status(400).json({success : false , error: 'Please enter all fields' });
        }

        const user = await User.findById(createdBy);
        let verified = false;

        if(user?.accountType == 'admin'){
            verified = true;
        }

        const uploadImg = await UploadToCloudinary(thumbnail , process.env.FOLDER_NAME!);

        const quiz = await Quiz.create({
            name,
            description,
            createdBy,
            language,
            verified,
            image: uploadImg.secure_url,
        });

        user?.quizes.push(quiz._id);

        await user?.save();


        return res.status(200).json({
            success: true,
            quiz,
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
}

export const createAssignment = async (req: Request, res: Response) => {
    try{
        const {
            name,
            description,
            instructions,
        } = req.body;

        if(!name || !description || instructions.length === 0){
            return res.status(400).json({success : false , error: 'Please enter all fields' });
        }

        const assignment = await Assignment.create({
            name,
            description,
            instructions: instructions,
        });

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.quizId,
            { $push: { assignment: assignment._id } },
            { new: true }
          );
          

        return res.status(200).json({
            success: true,
            assignment,
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
};

export const createQuestion = async (req: Request, res: Response) => {
    try{
        const {
            question,
            options,
            answer,
            points
        } = req.body;

        
        if(!question || !options || !answer || !points){
            return res.status(400).json({success : false , error: 'Please enter all fields' });
        }

        const saveQuestion = await Question.create({
            question,
            options,
            answer,
            points
        });

        const SaveToAssignment = await Assignment.findByIdAndUpdate(req.params.assignmentId, {
            $push: { questions: saveQuestion._id },
            $inc: { maxscore: points } // Increment maxscore by points
        }, { new: true });
                  
        return res.status(200).json({
            success: true,
            saveQuestion,
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
}

export const submitQuiz = async (req: AuthReq, res: Response) => {
    try{
        const {answers , timeRemaining } = req.body;

        const {quizId} = req.params;

        if(!answers || !timeRemaining){
            return res.status(400).json({success : false , error: 'Please enter all fields' });
        }

        let totalscore : number = 0;
        let correct = 0;

        for(const key in answers){
            const question = await Question.findById(new mongoose.Types.ObjectId(key));
            console.log(question)
            if(question?.answer === answers[key].toString()){
                totalscore += question!.points;
                correct++;
            }
        }

        totalscore = Math.floor(totalscore * timeRemaining / 1000);

        let quizAttempt = await QuizAttempt.create({
            quiz: quizId,
            user: req.user.id,
            totalscore
        });

        const updateUser = await User.findByIdAndUpdate(req.user.id, {
            $push: { quizAttempts: quizAttempt._id } }, {new : true}
        );

        const updateQuiz = await Quiz.findByIdAndUpdate(quizId, {
            $push: { leaderboard: quizAttempt._id } }, {new : true}
        );
        
         
        console.log(totalscore)

        res.status(200).json({
            success: true,
            message: 'Quiz submitted successfully',
            quizAttempt,
            correct
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
}