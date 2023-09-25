import { createSlice , PayloadAction } from '@reduxjs/toolkit';
import { IQuiz } from '../types';


interface QuizState {
    data : IQuiz | null;
    mode : string;
    making : boolean;
}


const initialState : QuizState = {
    data : null,
    mode : 'quiz',
    making : false,
}

const quizSlice = createSlice({
    name : 'quiz',
    initialState: initialState,
    reducers : {
        setQuiz(state : QuizState , action : PayloadAction<IQuiz>) {
            state.data = action.payload;
            state.making = true;
        },
        setMode(state : QuizState , action : PayloadAction<string>) {
            state.mode = action.payload;
        },
        removeQuiz(state : QuizState) {
            state.data = null;
            state.making = false;
        }
    },
});

export const { setQuiz , setMode , removeQuiz } = quizSlice.actions;

export default quizSlice.reducer;