import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing-bg h-screen font-Hand">
      <div className="flex gap-8 justify-end mr-20 pt-10">
        <Link to="/SignUp">
          <button className="font-3xl hover:scale-105 w-[100px] sm:w-[100px] bg-white sm:text-lg font-bold text-black px-4 py-2 sm:px-6 sm:py-3 border-4 border-black hover:border-white hover:bg-black hover:text-white transition duration-300 ease-in-out">
            Sign Up
          </button>
          </Link>
          <Link to="/login">
          <button className="hover:scale-105 flex justify-center selection:hover:scale-125 w-[100px] sm:w-[100px] bg-white text-xl sm:text-lg font-bold text-black px-4 py-2 sm:px-6 sm:py-3 border-4 border-black hover:border-white hover:bg-black hover:text-white transition duration-300 ease-in-out">
            <span className="mr-1">Login</span>
            <FiLogIn className="mt-1" />
          </button>
        </Link>
      </div>
      <div className=" mt-[8rem] flex flex-col justify-center items-center font-Hand">
        <h1 className="mb-[2rem] text-7xl lg:text-9xl font-bold p-4 text-center outline-8 italic from-black to-black bg-gradient-to-r bg-clip-text text-transparent">
          Welcome to LINGO
        </h1>

        <div className="w-[80%] flex  lg:justify-evenly lg:flex-row flex-col gap-3">
          <button className="mx-auto hover:scale-125 w-[180px] lg:w-[400px] bg-white text-2xl lg:text-4xl font-bold text-black px-4 py-2 sm:px-6 sm:py-3 border-4 border-black hover:border-white hover:bg-black hover:text-white transition duration-300 ease-in-out">
            PLAY AND COMPETE!!
          </button>
          <button className="mx-auto hover:scale-125 w-[180px] lg:w-[400px] bg-white text-2xl lg:text-4xl font-bold text-black px-4 py-2 sm:px-6 sm:py-3 border-4 border-black hover:border-white hover:bg-black hover:text-white transition duration-300 ease-in-out">
            MAKE YOUR OWN!!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
