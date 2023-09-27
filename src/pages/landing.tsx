
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <>
      <Navbar />
      <div className="mt-5 w-full h-full">

        <div className="lg:mt-[15rem] mt-[5rem] flex flex-col justify-center items-center">
          <h1 className="mb-[2rem] text-7xl lg:text-9xl font-bold p-4 text-center outline-8 italic from-black to-black bg-gradient-to-r bg-clip-text text-transparent">
            Welcome to LINGO !!!
          </h1>

          <div className="w-[80%] flex items-center lg:justify-evenly lg:flex-row flex-col gap-3">
            <Link to="/home">
            <button className="mx-auto hover:scale-125 w-[180px] lg:w-[400px] bg-white text-2xl lg:text-4xl font-bold text-black px-4 py-2 sm:px-6 sm:py-3 border-4 border-black hover:border-white hover:bg-black hover:text-white transition duration-300 ease-in-out">
              PLAY!!
            </button>
            </Link>
            <Link to="/workshop">
            <button className="mx-auto hover:scale-125 w-[180px] lg:w-[400px] bg-white text-2xl lg:text-4xl font-bold text-black px-4 py-2 sm:px-6 sm:py-3 border-4 border-black hover:border-white hover:bg-black hover:text-white transition duration-300 ease-in-out">
              MAKE YOUR OWN!!
            </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
