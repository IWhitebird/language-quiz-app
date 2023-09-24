import './App.css'
import Login from './pages/login';
import SignUp from './pages/signup';
import Home from './pages/home';
import Landing from './pages/landing';
import Quiz from './pages/Quiz';
import { Routes, Route } from 'react-router-dom';
import PlayQuiz from './pages/PlayQuiz';
import Dashboard from './pages/dashboard';

function App() {

  return (
    <div className='bg-[##e1e1e1] min-h-screen flex flex-col font-Nuni'>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/SignUp' element={<SignUp />} />2
        <Route path="/home" element={<Home />} />
        <Route path='/quiz/:id' element={<Quiz />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/quiz/play/:id' element={<PlayQuiz />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App
