import express , {Request , Response} from 'express';
import  Quiz  from '../models/quiz';
import  User  from '../models/user';
import Assignment from '../models/assignment';
import Question from '../models/question';

export const getAllQuiz = async (req: Request, res: Response) => {
    try {
        const quiz = await Quiz.find({}).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question'
            }
        })

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

        const quiz = await Quiz.findById(quizId).populate('assignment').populate({
            path: 'assignment',
            populate: {
                path: 'questions',
                model: 'Question'
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

export const createQuiz = async (req: Request, res: Response) => {
    try{
        const {
            name,
            description,
            createdBy,
            language
        } = req.body;
        
        if(!name || !description || !createdBy || !language){
            return res.status(400).json({success : false , error: 'Please enter all fields' });
        }

        const user = await User.findById(createdBy);
        let verified = false;

        if(user?.accountType == 'admin'){
            verified = true;
        }

        const quiz = await Quiz.create({
            name,
            description,
            createdBy,
            language,
            verified
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
        } = req.body;

        if(!name || !description){
            return res.status(400).json({success : false , error: 'Please enter all fields' });
        }

        const assignment = await Assignment.create({
            name,
            description,
            instructions: req.body?.instructions || null,
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
            $push: { questions: saveQuestion._id } }, {new : true}
        );
                                
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