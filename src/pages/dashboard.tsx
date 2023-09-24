import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [selected, setSelected] = useState("Profile");

  console.log(user);

  return (
    <div className="flex gap-7 h-screen">
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col gap-5">

        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Dasboard</h1>
          <Link to="/home" className="text-3xl hover:translate-x-[-3px] hover:scale-105">
            <BiArrowBack />
            </Link>
        </div>

        <div className="mb-4">
          <img
            src={user?.image}
            alt="User Profile"
            className="w-16 h-16 rounded-full mx-auto"
          />
          <p className="text-center mt-2 text-3xl">
            {user?.firstName} {user?.lastName}
          </p>
        </div>

        <div
          onClick={() => setSelected("Profile")}
          className={`hover:bg-slate-200 transition-all duration-200 ease-in-out 
        cursor-pointer border-2 border-black rounded-lg p-5 text-xl hover:scale-105
        ${selected === "Profile" ? "bg-slate-400" : ""}`}
        >
          <h2 className="font-semibold">Profile</h2>
        </div>

        <div
          onClick={() => setSelected("Past")}
          className={`hover:bg-slate-200 transition-all duration-200 ease-in-out 
        cursor-pointer border-2 border-black rounded-lg p-5 text-xl hover:scale-105
        ${selected === "Past" ? "bg-slate-400" : ""}`}
        >
          <h2 className="font-semibold">Past Quizzes</h2>
        </div>

        <div
          onClick={() => setSelected("Logout")}
          className={`hover:bg-slate-200 transition-all duration-200 ease-in-out 
        cursor-pointer border-2 border-black rounded-lg p-5 text-xl hover:scale-105
        ${selected === "Logout" ? "bg-slate-400" : ""}`}
        >
          <h2 className="font-semibold">Logout</h2>
        </div>
      </div>

      <div className="w-3/4 p-4">
        {selected === "Profile" && (
          <div className="h-screen flex justify-center items-center">
            <div className="w-[70%] mx-auto flex">
              <div className="flex flex-col w-full border-2 border-black rounded-lg p-10">
                <div className="h-[30%] flex flex-row gap-10">
                  <div className="w-[180px] ">
                    <img src={user?.image} className="rounded-lg"></img>
                    <div
                      className="rounded-md h-[50px] flex justify-center items-center text-xl
                   mt-5 bg-slate-800 hover:scale-110 text-white text-center transition-all duration-300
                   ease-in-out "
                    >
                      Upload Image
                    </div>
                  </div>

                  <div className="lg:ml-7">
                    <div className="flex flex-col text-3xl gap-6">
                      <p className="border-[1px] border-black rounded-lg p-2">
                        User : {user?.username}
                      </p>
                      <p className="border-[1px] border-black rounded-lg p-2">
                        Firstname :{user?.firstName}
                      </p>
                      <p className="border-[1px] border-black rounded-lg p-2">
                        Lastname :{user?.lastName}
                      </p>
                      <p className="border-[1px] border-black rounded-lg p-2">
                        Email :{user?.email}
                      </p>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        )}

        {selected === "Past" && 
        <div className="h-screen flex justify-center items-center">
            <div>

            </div>
        </div>}

        {selected === "Logout" && 
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
          <div className="w-[30%] h-[20%] bg-slate-500 border-2 border-black flex flex-col rounded-lg">
            <h1 className="text-white text-3xl p-4">
              Are you sure you want to logout?
            </h1>

            <div className="flex flex-row gap-3 justify-evenly text-xl">
              <button className="w-[130px] h-[50px] bg-black text-white hover:scale-110 transition-all duration-200 ease-in-out rounded-lg">
                Logout
              </button>
              <button
                onClick={() => setSelected('Profile')}
                className="w-[130px] h-[50px] bg-black text-white hover:scale-110 transition-all duration-200 ease-in-out rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

          }
      </div>
    </div>
  );
};

export default Dashboard;
