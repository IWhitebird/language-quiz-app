import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Logout from "../components/Logout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [selected, setSelected] = useState("Profile");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  async function refetchUser() {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.statusText === "OK") {
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    refetchUser();
  }, []);

  function convertISOToNormal(isoDateString: any) {
    const date = new Date(isoDateString);
    const opt: any = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const formattedDate = date.toLocaleString(undefined, opt);
    return formattedDate;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Progress",
      },
    },
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const languageMonthlyData: any = {};

  const languages = [
    ...new Set(user?.progress.map((item: any) => item.language)),
  ]; // Get unique languages
  languages.forEach((language: any) => {
    languageMonthlyData[language] = {
      data: new Array(12).fill(0),
    };
  });

  user?.progress.forEach((item) => {
    const date = new Date(item.date);
    const monthIndex = date.getMonth();
    const score = item.score;
    const language = item.language;

    languageMonthlyData[language].data[monthIndex] += score;
  });

  const datasets: any = [];
  languages.forEach((language: any) => {
    datasets.push({
      data: languageMonthlyData[language].data,
      label: language,
      borderColor: getRandomColor(),
      fill: false,
    });
  });

  const data = {
    labels: months,
    datasets: datasets,
  };

  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  console.log(user);

  return (
    <div className="flex gap-7 h-screen">
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col gap-5 fixed top-0 h-[100vh]">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Dasboard</h1>
          <Link
            to="/home"
            className="text-4xl hover:translate-x-[-5px] hover:scale-105 transition-all
           duration-200 ease-in-out"
          >
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
          <h2 className="font-semibold">Past Attempt's</h2>
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

      <div className="w-3/4 p-4 ml-[30rem]">
        {selected === "Profile" && (
          <>
          <p className="text-6xl font bold ml-9 mt-6">Profile</p>
          <div className="h-screen flex flex-col justify-center items-center gap-5 mt-10">
            <div className="w-[70%] mx-auto flex">
              <div className="flex flex-col w-full border-2 border-black rounded-lg p-10">
                <div className="h-[30%] flex flex-row gap-10">
                  <div className="w-[180px] ">
                    <img src={user?.image} className="rounded-lg"></img>
                    {/* <div
                      className="rounded-md h-[50px] flex justify-center items-center text-xl
                   mt-5 bg-slate-800 hover:scale-110 text-white text-center transition-all duration-300
                   ease-in-out "
                    >
                      Upload Image
                    </div> */}
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

            <div className="w-[70%] border-2 border-black mt-5 mb-10">
              <Line options={options} data={data} />
            </div>
          </div>
          </>
        )}
        {selected === "Past" && (
          <>
            <p className="text-6xl font bold ml-9 mt-6">Past Attempt's</p>
          <div className="h-screen flex justify-center items-center">
            <div className="w-[70%] mt-[20rem]">
              {user?.recent.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col border-2 border-black rounded-lg p-5 mb-5"
                >
                  <div className="flex justify-between">
                    <div className="flex flex-row justify-between w-full mb-6">
                      <p className="text-4xl font-bold">{item.quiz.name}</p>
                      <Link to="">
                        <div className="text-3xl">View</div>
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-3xl">Language : {item.quiz.language}</p>
                    <p className="text-3xl">
                      Date : {convertISOToNormal(item.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-center">
                      Score : {item.totalscore}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>
        )}

        {selected === "Logout" && <Logout fun={setSelected} val={"profile"} />}
      </div>
    </div>
  );
};

export default Dashboard;
