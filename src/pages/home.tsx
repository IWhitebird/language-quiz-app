import  { useState, useEffect } from 'react';
import { IQuiz } from '../types';
import Card from '../components/Card';
import axios from 'axios';

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
    <div className="p-4 font-Hand">

      <div className='mx-auto w-[90%]  mt-5'>
        <h1 className="text-3xl font-bold mb-4 ">
          Ready to Compete?</h1>
        <p className="text-lg mb-4 ml-4">
           You can give premade quizzes and compete with other learners for the leaderboard position and earn rewards.
        </p>
        <p className="text-lg mb-4 ml-4">
          Want to create your own quiz? Head to our workshop and create your own quiz to share it with your friends.
        </p>
      </div>

      <div className="w-[80%] flex flex-col mx-auto mt-8">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold mb-4">Popular Quizzes</h1>

          <div className="mb-4">
            <select className="border border-gray-300 p-2 rounded">
              <option value="english" selected>
                English
              </option>
              <option value="hindi">Hindi</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quizs?.map((quiz: IQuiz , i : number) => (
            <Card key={i} quiz={quiz} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
