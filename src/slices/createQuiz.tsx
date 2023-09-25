import { createSlice , PayloadAction } from '@reduxjs/toolkit';
import { IQuiz } from '../types';


interface QuizState {
    data : IQuiz | null;
    mode : string;
    state : boolean;
}


const initialState : QuizState = {
    data : null,
    mode : 'quiz',
    state : localStorage.getItem('state') ? true : false,
}

const quizSlice = createSlice({
    name : 'quiz',
    initialState: initialState,
    reducers : {
        setQuiz(state : QuizState , action : PayloadAction<IQuiz>) {
            state.data = action.payload;
            state.state = true;
        },
        setMode(state : QuizState , action : PayloadAction<string>) {
            state.mode = action.payload;
        },
        removeQuiz(state : QuizState) {
            state.data = null;
            state.state = false;
        }
    },
});

export const { setQuiz , setMode , removeQuiz } = quizSlice.actions;

export default quizSlice.reducer;