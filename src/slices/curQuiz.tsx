import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQuiz } from '../types';

interface QuizState {
  curquiz: IQuiz | any;
}

const initialState: QuizState = {
    curquiz: null,
};


const quizSlice = createSlice({
  name: 'quiz',
  initialState: initialState,
  reducers: {
    setCurQuiz(state: QuizState, action: PayloadAction<IQuiz>) {
      state.curquiz = action.payload;
    },
  },
});

export const { setCurQuiz } = quizSlice.actions;

export default quizSlice.reducer;
