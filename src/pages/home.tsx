import  { useState, useEffect } from 'react';
import { IQuiz } from '../types';
import Card from '../components/Card';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Home = () => {
  const [quizs, setQuizs] = useState<IQuiz[]>([]);

  useEffect(() => {
    fetchAllQuizzes();  
  }, []);

  async function fetchAllQuizzes() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in local storage');
        return;
      }

      const response = await axios.get(
        import.meta.env.VITE_API_URL + '/quiz/getAllquizes',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuizs(response.data.quiz); 
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <>
      <Navbar />
      <div className="p-4 w-[100%] mt-16">

        <div className='mx-auto w-[90%]  mt-5'>
          <h1 className="text-5xl lg:text-7xl font-bold mb-4 ">
            Ready to Compete?</h1>
          <p className="text-xl lg:text-3xl mb-4 ml-4">
            You can give premade quizzes and compete with other learners for the leaderboard position and earn rewards.
          </p>
          <p className="text-xl lg:text-3xl mb-4 ml-4">
            Want to create your own quiz? Head to our workshop and create your own quiz to share it with your friends.
          </p>
        </div>

        <div className="w-[80%] flex flex-col mx-auto mt-8 lg:mx-auto">
          <div className="flex flex-row justify-between">
            <h1 className="text-5xl font-bold mb-4">Popular Quizzes</h1>

            <div className="mb-4 self-center">
              <select className="border border-gray-300 p-2 rounded">
                <option value="english" selected>
                  English
                </option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-4 md:grid-cols-3 justify-evenly lg:ml-14 gap-y-20">
            {quizs?.map((quiz: IQuiz , i : number) => (
              <Card key={i} quiz={quiz} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Home;
