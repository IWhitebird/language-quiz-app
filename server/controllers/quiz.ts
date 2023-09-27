import  {Request , Response} from 'express';
import  Quiz  from '../models/quiz';
import  User  from '../models/user';
import Assignment from '../models/assignment';
import Question from '../models/question';
import QuizAttempt from "../models/quizAttempt";
import { AuthReq, IAssignment, IQuestion } from '../types';
import mongoose from 'mongoose';
import { UploadToCloudinary } from '../utils/imageUpload';

import dotenv from 'dotenv';
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
            time,
        } = req.body;

        const createdBy = req.user.id;

        const thumbnail = req.files.thumbnail;
        
        if(!name || !description || !language || !time || !thumbnail){
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
            time,
            image: uploadImg.secure_url,
        });

        await User.findByIdAndUpdate(createdBy , {
            $push: { quizes: quiz._id }
        });

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

        const parsedinstructions = await JSON.parse(instructions);

        const assignment = await Assignment.create({
            name,
            description,
            instructions: parsedinstructions,
        });

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.quizId,
            { $push: { assignment: assignment._id } },
            { new: true }
          ).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question',
            }
        });

          

        return res.status(200).json({
            success: true,
            quiz : updatedQuiz,
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

        const parsedOptions = await JSON.parse(options);

        const saveQuestion = await Question.create({
            question,
            options : parsedOptions,
            answer,
            points
        });

        const SaveToAssignment = await Assignment.findByIdAndUpdate(req.params.assignmentId, {
            $push: { questions: saveQuestion._id },
            $inc: { maxscore: points } 
        }, { new: true });

        const quiz = await Quiz.findById(req.params.quizId).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question',
            }
        });
                  
        return res.status(200).json({
            success: true,
            quiz : quiz,
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
}

export const publishQuiz = async (req: AuthReq, res: Response) => {
    try{
        const {quizId} = req.params;

        if(!quizId){
            return res.status(400).json({success : false , error: 'Please enter all fields' });
        }


        const quiz = await Quiz.findByIdAndUpdate(quizId, {
            $set: { status: 'published' }
          });

        return res.status(200).json({
            success: true,
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

export const submitQuiz = async (req: AuthReq, res: Response) => {
    try{
        const {answers , timeRemaining} = req.body;

        const {quizId} = req.params;

        if(!answers || !timeRemaining){
            return res.status(400).json({success : false , error: 'Please enter all fields' });
        }

        let totalscore : number = 0;
        let correct = 0;

        for(const key in answers){
            const question = await Question.findById(new mongoose.Types.ObjectId(key));
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

        const lang = await Quiz.findById(quizId).select('language');

        const progressPayload = {
            language : lang?.language,
            score : totalscore,
        }

        const updateUser = await User.findByIdAndUpdate(
            req.user.id,
            {
              $push: {
                recent: quizAttempt._id,
                progress: progressPayload
              }
            },
            { new: true }
          );
          
        const updateQuiz = await Quiz.findByIdAndUpdate(quizId, {
            $push: { leaderboard: quizAttempt._id } }, {new : true}
        );

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

export const deleteQuiz = async (req: Request, res: Response) => {
    try{
        const {quizId} = req.params;

        const quiz = await Quiz.findById(quizId);

        if(!quiz){
            return res.status(400).json({success : false , error: 'Quiz not found' });
        }

        const assignments : IAssignment[] = await Assignment.find({ quiz: quizId });

        for (let assignment of assignments) {

            for( const question of assignment.questions){
                await Question.findByIdAndDelete(question);
            }
            Assignment.findByIdAndDelete(assignment._id);
        }   


        for(const quizAId of quiz.leaderboard){
            const quizA = await QuizAttempt.findById(quizAId);

            await User.findByIdAndUpdate(quizA?.user, {
                $pull: { recent: quizA?._id }
            });

            await QuizAttempt.findByIdAndDelete(quizA?._id);
        }

        const user = await User.findByIdAndUpdate(quiz.createdBy , {
                $pull: { quizes: quiz._id }
            });   

        await Quiz.findByIdAndDelete(quizId);

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully',
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

export const deleteAssignment = async (req: Request, res: Response) => {
    try{
        const quizId = req.params.quizId;

        const assignId = req.params.assignId;


        const assignment = await Assignment.findById(assignId)

        if(assignment?.questions !== undefined){
            for(let question of assignment?.questions){
                await Question.findByIdAndDelete(question);
            }
        }

        await Assignment.findByIdAndDelete(assignId);
        
        const updateQuid = await Quiz.findByIdAndUpdate(quizId, {
            $pull: { assignment: assignId }
        }, {new : true}).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question',
            }
        });;
        

        res.status(200).json({
            success: true,
            message: 'Assignment deleted successfully',
            quiz: updateQuid,
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

export const deleteQuestion = async (req: Request, res: Response) => {
    try{
        const quizId = req.params.quizId;
        const assignId = req.params.assignId;
        const quesId = req.params.quesId;

        await Assignment.findByIdAndUpdate(assignId ,
            { $pull: { questions: quesId } },
            { new: true }
          );

        await Question.findByIdAndDelete(quesId);

        const updateQuid = await Quiz.findById(quizId).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question',
            }
        });

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully',
            quiz: updateQuid,
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