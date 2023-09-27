import { Link } from "react-router-dom";
import { IQuiz } from "../types";
import { AiOutlineDelete } from "react-icons/ai";

const Card = ({
  quiz,
  type,
  editHandle,
  handleDelete,
}: {
  quiz: IQuiz;
  type: string;
  editHandle?: any;
  handleDelete?: any;
}) => {

  return (
    <div className="bg-white border-[3px] shadow-md shadow-black sha p-2 rounded-sm border-black w-full lg:w-[22rem] h-[550px] hover:scale-[1.1] transition-all ease-in-out duration-300 ">
      <img src={quiz?.image} className="w-[100%] h-[40%] mx-auto" alt="img" />

      <div className="w-[100%] mx-auto">
        <hr className="mt-1" />
        <h1 className="text-3xl font-bold mt-3 mb-3">{quiz?.name}</h1>
        <h2 className="text-xl min-h-[70px] max-h-[70px] lg:min-h-[120px] lg:max-h-[120px]">
          {quiz?.description?.slice(0, 50)}{" "}
          {quiz?.description?.length >= 50 ? "..." : ""}
        </h2>
        <div className="flex flex-col justify-between text-xl">
          <h3 className="text-md">
            Langauge : <span className="font-bold">{quiz?.language}</span>
          </h3>
        </div>
        {type && type === "workshop" && (
          <>
            <div className="mt-2 relative flex flex-row justify-between items-center">
              <div onClick={editHandle}>
                <button
                  className="mt-4 ml-2 w-[130px] h-[40px] text-xl
                   bg-black text-white hover:scale-110 transition-all ease-in-out 
                   duration-300 hover:bg-white border-black hover:border-2 hover:text-black "
                >
                  Edit
                </button>
              </div>

              <Link to={`/quiz/${quiz._id}`}>
                <button
                  className="mt-4 ml-2 w-[130px] h-[40px] text-xl
                   bg-black text-white hover:scale-110 transition-all ease-in-out
                    duration-300 hover:bg-white border-black hover:border-2 hover:text-black "
                >
                  View
                </button>
              </Link>

              <div
                onClick={handleDelete}
                className="hidden lg:block cursor-pointer text-3xl mt-3 hover:scale-110 
                transition-all ease-in-out duration-300"
              >
                <AiOutlineDelete />
              </div>
            </div>

            <div
              onClick={handleDelete}
              className="lg:hidden flex justify-center w-full cursor-pointer text-3xl mt-5 hover:scale-110 
transition-all ease-in-out duration-300"
            >
              <AiOutlineDelete />
            </div>
          </>
        )}

        {type && type === "home" && (
          <div className="mt-2 relative flex flex-row justify-between">
            <Link to={`/quiz/${quiz._id}`}>
              <button className="mt-4 ml-2 w-[130px] h-[40px] text-xl bg-black text-white hover:scale-110 transition-all ease-in-out duration-300 hover:bg-white border-black hover:border-2 hover:text-black ">
                Leaderboard
              </button>
            </Link>

            <Link to={`/quiz/${quiz._id}`}>
              <button className="mr-2 rounded-full w-[70px] h-[70px] text-xl bg-black text-white hover:scale-110 transition-all ease-in-out duration-300 hover:bg-white border-black hover:border-2 hover:text-black ">
                Play
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
