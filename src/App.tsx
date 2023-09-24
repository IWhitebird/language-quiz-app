import './App.css'
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Landing from './pages/landing';
import Quiz from './pages/Quiz';
import { Routes, Route } from 'react-router-dom';
import PlayQuiz from './pages/PlayQuiz';
import Dashboard from './pages/dashboard';
import PrivateRoute from './components/CloseRoute';
import Workshop from './pages/workshop';

function App() {

  return (
    <div className='bg-[##e1e1e1] min-h-screen flex flex-col font-Nuni'>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/home" element={<Home />} />

        
          <Route path='/quiz/:id' element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          } />

          <Route path='/dashboard' element={
            <PrivateRoute>
              <Dashboard />
           </PrivateRoute>
          } />
        

          <Route path='/quiz/play/:id' element={
            <PrivateRoute>
              <PlayQuiz />
            </PrivateRoute>
          } />

          <Route path='/workshop' element={
            <PrivateRoute>
              <Workshop />
            </PrivateRoute>
          } />


        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App
