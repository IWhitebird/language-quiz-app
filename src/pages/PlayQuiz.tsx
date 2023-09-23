import { useEffect, useState } from "react";
import { IQuiz } from "../types";
import axios from "axios";

const PlayQuiz = () => {
  const [quiz, setQuiz] = useState<IQuiz>();
  const [time, setTime] = useState<string>('00:00:00');
  const [answers, setAnswers] = useState<string[]>([]);

  const char = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const localquiz = localStorage.getItem("cur_quiz");

  const timeValue = new Date(JSON.parse(localquiz!).time);

  const timeRemaining = timeValue.getTime() - Date.now();
  useEffect(() => {
    fetchCompleteQuiz();
    if(timeRemaining > 0){
      setTime(millisecondsToTime(timeRemaining));
    }
  }, []);

  function millisecondsToTime(ms : number) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return formattedTime;
  }

  async function timeOverHandle() {

  //   try{
  //     const token = localStorage.getItem("token");
  //     const quizId = JSON.parse(localquiz!).quizId;
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + `/quiz/submitQuiz/${quizId}`,
  //       {
  //         answers: [],
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //   }
  // catch(error){
  //   console.log(error);
  // }
  

  }

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const [hours, minutes, seconds] = time.split(':').map(Number);
  
      if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(countdownInterval);
        timeOverHandle(); // Call the function when time reaches '00:00:00'
      } else {
        let newHours = hours;
        let newMinutes = minutes;
        let newSeconds = seconds;
  
        if (seconds <= 0) {
          if (minutes <= 0) {
            if (hours <= 0) {
              setTime('00:00:00');
              clearInterval(countdownInterval); 
              timeOverHandle(); 
              return;
            } else {
              newHours -= 1;
            }
            newMinutes = 59;
          } else {
            newMinutes -= 1;
          }
          newSeconds = 59;
        } else {
          newSeconds -= 1;
        }
  
        const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
        setTime(newTime);
      }
    }, 1000);
  
    return () => {
      clearInterval(countdownInterval);
    };
  }, [time, timeOverHandle]);
  

  async function fetchCompleteQuiz() {
    try {
      const token = localStorage.getItem("token");
      if (!localquiz) return;
  
      const quizId = JSON.parse(localquiz).quizId;
  
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/quiz/getCompleteQuiz/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setQuiz(response.data.quiz);
      console.log(response.data); 
    } catch (error) {
      console.error(error); 
    }
  }
  return (
    <div>
      <div className="absolute w-full ">
        <div
          className=" w-[80%] text-3xl items-center bg-black mx-auto 
          h-[50px] mt-5 rounded-[15px] text-white flex justify-between p-8"
        >
          <div className="flex flex-row items-center gap-10 h-full">
            <h1 className="">Quiz Name : </h1>
            <h1 className="font-bold">{quiz?.name}</h1>
          </div>

          <div className="items-center lg:mr-[8rem]">
            <h1 className="">Good Luck!!!</h1>
          </div>

          <div className="hover:scale-125 hover:text-cyan-500 transition-all ease-in-out duration-300">
            <h1>{time}</h1>
          </div>
        </div>
      </div>

      <div className="mt-[10rem] w-[80%] mx-auto">
        {
          quiz?.assignment.map((ass, index) => {
            return(
              <div key={index}>
                <div className="text-4xl flex flex-row justify-between">
                  <div>
                    Assignment {index} : {ass.name}
                  </div>
                  <div>
                    Points : {ass.maxscore}
                  </div>
                </div>

                <div className=" indent-8 mt-2">
                  {ass.description}
                </div>

                <div>
                  <ul>
                    {
                      ass.instructions?.map((item , i) => (
                        <li key={i}>{item}</li>
                      ))
                    }
                  </ul>
                </div>

                <div className="mt-5">
                   {
                      ass.questions?.map((que , i) => (
                        <div key={i} className="text-3xl font-bold mt-5 border-[2px] p-10 rounded-md border-black">
                          <div>
                            <div className="flex flex-row justify-between">
                              <p>
                                Q.{i+1} {que.question}
                              </p>

                              <p>
                                {que.points}
                              </p>

                            </div>

                            <div className="grid grid-cols-2 gap-7 mt-5 ml-8">
                              {que.options?.map((opt, i) => (
                                <div key={i} className="flex items-center">
                                  <input type="radio" className="border-[2px] rounded-lg p-5" />
                                  <span className="ml-2">{char[i]}. {opt}</span>
                                </div>
                              ))}
                            </div>


                          </div>
                        </div>
                      ))
                    }        
                </div>
              </div>
            )
          })
        }
      </div>

    </div>
  );
};

export default PlayQuiz;
