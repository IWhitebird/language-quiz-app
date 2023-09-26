import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IAssignment, IQuiz } from "../types";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

const Quiz = () => {
  const id = useParams();
  const [quiz, setQuiz] = useState<IQuiz>();
  const [isActive, setIsActive] = useState<string>("Assignment");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  async function fetchQuiz() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        import.meta.env.VITE_API_URL +
          `/quiz/getSingleQuiz/${Object.values(id)[0]}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuiz(response.data.quiz);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const startHandle = () => {

    const time = (1000 * 60 * quiz!.time || 1000 * 60 * 10) + 2;

    const payload = {
      quizId: Object.values(id)[0],
      time: new Date(Date.now() + time),
    };
    localStorage.setItem("cur_quiz", JSON.stringify(payload));
    window.location.href = `/quiz/play/${Object.values(id)[0]}`;
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg">
          <Loading />
        </div>
      )}

      <Link
        to="/home"
        className="z-50 absolute left-[5.5rem] top-[2.3rem] text-4xl hover:-translate-x-4 hover:scale-110
        transition-all duration-200 ease-in-out"
      >
        <BiArrowBack />
      </Link>
      <Navbar />
      <div className="w-[90%] mt-[9rem] mx-auto">
        <div className="flex flex-col lg:flex-row w-[90%] mx-auto lg:gap-2">
          <div className="flex flex-col w-full lg:w-[40%]">
            <h1 className="text-6xl mb-6 font-bold capitalize">{quiz?.name}</h1>
            <h2 className="text-2xl ml-6 indent-10 lg:min-h-[150px]">
              {quiz?.description}
            </h2>
            <hr style={{ borderColor: "black" }} />
            <hr style={{ borderColor: "black" }} />

            <div className="mt-2 gap-3 flex flex-col">
              <h3 className="text-3xl ml-6 ">
                {" "}
                <span className="font-bold">Language : </span>
                {quiz?.language}
              </h3>
              <h3 className="text-3xl ml-6 ">
                <span className="font-bold">Created By :</span>{" "}
                {quiz?.createdBy.username}
              </h3>
            </div>
          </div>
          <div className="w-full lg:w-[60%]">
            <div className=" mx-auto max-w-[80%] max-h-full border-2 border-black rounded-md">
              <img
                className="w-full h-auto lg:h-[300px] object-fit"
                src={quiz?.image}
                alt="quiz image"
              />
            </div>
          </div>
        </div>

        <div className="h-1 bg-black w-full mt-5"></div>

        <div className="mt-10">
          <div className="flex flex-row mx-auto justify-around mb-7 w-[50%] gap-3 lg:gap-0">
            <div
              className={`${
                isActive === "Assignment"
                  ? "bg-black text-white"
                  : "text-black border-2 border-black"
              }  h-[60px] w-[250px] text-2xl rounded-md text-center pt-4 transition-colors
               ease-in-out duration-300 hover:cursor-pointer`}
              onClick={() => setIsActive("Assignment")}
            >
              Assignemnts
            </div>
            <div
              className={` ${
                isActive === "Leaderboard"
                  ? "bg-black text-white"
                  : "text-black border-2 border-black"
              } h-[60px] w-[200px] text-2xl rounded-md text-center pt-4
               transition-colors ease-in-out duration-300  hover:cursor-pointer`}
              onClick={() => setIsActive("Leaderboard")}
            >
              Leaderboard
            </div>
          </div>

          {isActive === "Assignment" ? (
            <div className="flex flex-col gap-5 text-xl w-[80%] mx-auto font-bold">
              {quiz?.assignment.map((assi: IAssignment, i: number) => {
                return (
                  <div
                    key={i}
                    className="hover:scale-110 transition-all duration-300 ease-in-out
                     hover:bg-black hover:text-white w-full h-[3rem] items-center 
                     p-5 flex flex-row justify-between border-black border-2 rounded-md text-center"
                  >
                    <h1 className="w-[20%]">Assignment No. {i+1}</h1>
                    <h4 className="w-[20%]">Name: {assi.name}</h4>
                    <h5 className="w-[20%]">{assi.description}</h5>
                    <h5 className="w-[20%]">{assi.maxscore}</h5>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-5 p-2 w-[70%] mx-auto min-h-[400px] mt-10">
              {quiz && quiz.leaderboard?.length > 0 ? (
                quiz?.leaderboard.slice(0, 10).map((lead: any, i: number) => (
                  <div
                    key={i}
                    className="text-3xl hover:scale-110 transition-all duration-300 ease-in-out
                     hover:bg-black  hover:text-white w-fullh-[3rem] rounded-full items-center p-3 flex flex-row 
                     justify-between border-black border-2"
                  >
                    <div className="min-w-[10%] max-w-[10%] ml-4">
                      <h4>{i + 1}</h4>
                    </div>
                    <div className="min-w-[10%] max-w-[10%]">
                      <img
                        className="w-[40px] rounded-lg"
                        src={lead.user.image}
                      ></img>
                    </div>

                    <div className="min-w-[20%] max-w-[20%]">
                      <h4>{lead.user.username}</h4>
                    </div>

                    <div className="min-w-[20%] max-w-[20%] text-center">
                      <h5>{lead.totalscore}</h5>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-5xl w-full mx-auto text-center mt-[10%]">
                  Be the first one to score!!!
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full flex justify-center mt-5">
          <button
            onClick={startHandle}
            className="mb-[5rem] mt-9 mx-auto w-[150px] h-[60px] rounded-md bg-black
             text-white text-3xl hover:scale-110 transition-all ease-in-out duration-300"
          >
            Start
          </button>
        </div>
      </div>
    </>
  );
};

export default Quiz;
