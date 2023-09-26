import { useState, useEffect } from "react";
import { IQuiz } from "../types";
import Card from "../components/Card";
import axios from "axios";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

const Home = () => {
  const [quizs, setQuizs] = useState<IQuiz[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  async function fetchAllQuizzes() {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/quiz/getAllquizes"
      );

      setQuizs(response.data.quiz);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-4 w-[100%] mt-16">
        <div className="mx-auto w-[80%]  mt-10">
          <h1 className="text-5xl lg:text-7xl font-bold mb-4 ">
            Ready to Compete?
          </h1>
          <p className="text-xl lg:text-3xl mb-4 ml-4">
            You can give premade quizzes and compete with other learners for the
            leaderboard position and earn rewards.
          </p>
          <p className="text-xl lg:text-3xl mb-4 ml-4">
            Want to create your own quiz? Head to our workshop and create your
            own quiz to share it with your friends.
          </p>
        </div>

        <div className="w-[80%] flex flex-col mx-auto mt-8 lg:mx-auto mb-10">
          <div className="flex flex-col lg:flex-row justify-between">
            <h1 className="text-5xl font-bold mb-4 text-center lg:text-left">
              Popular Quizzes
            </h1>

            <div className="mb-4 self-center">
              <select
                onChange={(e) => setSelectedLang(e.target.value)}
                className="text-2xl border-black border-[3px] p-2 rounded"
                defaultValue="All"
              >
                <option value="All">All</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="French">French</option>
                <option value="Japnese">Japnese</option>
                <option value="Mandarin">Mandarin</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
          </div>

          <div className="mb-4 h-1 bg-black w-full" />

          {loading ? (
            <div className="w-full h-full flex justify-center content-center mx-auto">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-1 mt-4 md:grid-col-2 lg:grid-cols-3 justify-evenly lg:ml-14 gap-y-20">
              {quizs?.filter(
                (q) => (q.language === selectedLang || selectedLang === "All") &&
                       (q.status === "draft")
              ).length > 0 ? (
                quizs
                  ?.filter(
                    (q) => q.language === selectedLang || selectedLang === "All"
                  )
                  .map((quiz: IQuiz, i: number) => <Card key={i} quiz={quiz} type='home' />)
              ) : (
                <div className="flex items-center justify-center col-span-3">
                  <p className="text-4xl font-bold">
                    No quiz found for this language 😥..
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
