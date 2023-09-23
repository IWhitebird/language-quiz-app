import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IAssignment, IQuiz } from "../types";1
import axios from "axios";

const Quiz = () => {
  const id = useParams();
  const [quiz, setQuiz] = useState<IQuiz>();
  const [isActive, setIsActive] = useState<string>("Assignment");

  useEffect(() => {
    fetchQuiz();
  }, []);

  async function fetchQuiz() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        import.meta.env.VITE_API_URL +
          `/quiz/getSingleQuiz/${Object.values(id)[0]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuiz(response.data.quiz);
    } catch (err) {
      console.error(err);
    }
    finally {
      console.log("Quiz", quiz);
    }
  }

  const startHandle =  () => {
    const payload = {
      quizId: Object.values(id)[0],
      time: new Date(Date.now() + 1000 * 60 * 30),
    };
    localStorage.setItem("cur_quiz", JSON.stringify(payload));
    window.location.href = `/quiz/play/${Object.values(id)[0]}`;
  };

  return (
    <div className="w-[90%] mt-[8rem] mx-auto">
      <div className="flex flex-col lg:flex-row w-full">
        <div className="flex flex-col w-full lg:w-[70%]">
          <h1 className="text-7xl mb-6 font-bold capitalize">{quiz?.name}</h1>
    
          <h2 className="text-3xl ml-6 indent-10 ">{quiz?.description}</h2>

          <div className="mt-2 p-2">
            <h3 className="text-3xl ml-6 "> <span className="font-bold">Language :</span>  {quiz?.language}</h3>
            <h3 className="text-3xl ml-6 ">
            <span className="font-bold">Created By  :</span>     {quiz?.createdBy.username}
            </h3>
          </div>
        </div>

        <div className="w-full h-full">
          <img className="object-cover" src={quiz?.image} alt="quiz image" />
        </div>
      </div>

      <hr />
      <hr />
      <hr />
      <hr />

      <div className="mt-10">
        <div className="flex flex-row mx-auto justify-around mb-7 w-[50%] gap-3 lg:gap-0">
          <div
            className={`${
              isActive === "Assignment"
                ? "bg-black text-white"
                : "text-black border-2 border-black"
            }  h-[60px] w-[250px] text-2xl rounded-md text-center pt-4 transition-colors ease-in-out duration-300 hover:cursor-pointer`}
            onClick={() => setIsActive("Assignment")}
          >
            Assignemnts
          </div>
          <div
            className={` ${
              isActive === "Leaderboard"
                ? "bg-black text-white"
                : "text-black border-2 border-black"
            } h-[60px] w-[200px] text-2xl rounded-md text-center pt-4 transition-colors ease-in-out duration-300  hover:cursor-pointer`}
            onClick={() => setIsActive("Leaderboard")}
          >
            Leaderboard
          </div>
        </div>

        {isActive === "Assignment" ? (
          <div className="flex flex-row gap-2 text-xl w-[80%] mx-auto font-bold">
            {quiz?.assignment.map((assi: IAssignment, i: number) => {
              return (
                <div
                  key={i}
                  className="w-full h-[3rem] items-center p-5 flex flex-row justify-between border-black border-2 rounded md "
                >
                  <h4>{assi.name}</h4>
                  <h5>{assi.description}</h5>
                  <h5>{assi.maxscore}</h5>
                </div>
              );
            })}
          </div>
        ) : (
          <div>hi</div>
        )}
      </div>

      <div className="w-full flex justify-center mt-5">
          
            <button onClick={startHandle} className="mx-auto w-[150px] h-[60px] rounded-md bg-black text-white text-3xl hover:scale-110 transition-all ease-in-out duration-300">
                Start
            </button>
      </div>
    </div>
  );
};

export default Quiz;
