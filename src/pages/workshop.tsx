import { useSelector } from "react-redux"
import Navbar from "../components/Navbar"
import { RootState } from "../reducer";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";

const Workshop = () => {

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  
  async function refetchUser() {
    try{
      const response = await axios.get(import.meta.env.VITE_API_URL + '/auth/me', 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.statusText === 'OK') {
        dispatch(setUser(response.data.user));
      }
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    refetchUser();
  } , []);


  return (
    <>
    <Navbar />
    <div>
      <div className="w-[80%] mx-auto mt-[150px]">
        
        <div className="flex flex-row justify-between">

          <div className="flex flex-col gap-5">
            <h1 className="text-6xl font-bold"> Workshop </h1>
            <h2 className="text-2xl">Create your own Quiz's and share it with your friend's!!</h2>
          </div>

          <Link to='/workshop/quizMake'>
            <div className="rounded-2xl bg-black w-[200px] h-[60px] text-xl text-white flex
              justify-center items-center border-2 border-black hover:border-black cursor-pointer
              hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
              >
                Create New
            </div>
          </Link>

        </div>

        <div className="h-[1px] bg-black mt-2" />

        <div className="grid grid-cols-1 mt-4 md:grid-col-2 lg:grid-cols-3 justify-evenly lg:ml-14 gap-y-20">

          {
            user?.quizes.map((quiz, index) => (
              <Card key={index} quiz={quiz} type='workshop' />
            ))
          }

        </div>

      </div>
    </div>
    </>
  )
}

export default Workshop