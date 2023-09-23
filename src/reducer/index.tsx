import { combineReducers } from 'redux';
import userReducer from '../slices/userSlice';
import quizReducer from '../slices/curQuiz';

const rootReducer = combineReducers({
    user: userReducer,
    curQuiz: quizReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;