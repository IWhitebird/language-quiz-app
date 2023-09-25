import { combineReducers } from 'redux';
import userReducer from '../slices/userSlice';
import quizRedcuer from '../slices/createQuiz';

const rootReducer = combineReducers({
    user: userReducer,
    quiz: quizRedcuer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;