import { useSelector } from "react-redux"
import Navbar from "../components/Navbar"
import { RootState } from "../reducer";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { useEffect , useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser} from "../slices/userSlice";
import { setState } from "../slices/createQuiz";
import toast from "react-hot-toast";

const Workshop = () => {

  const [deleteId , setDeleteId] = useState<any>('');

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  
  async function refetchUser() {
    try{
      const response = await axios.get(import.meta.env.VITE_API_URL + '/auth/me', 
      {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.data.success === true) {
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

  function editHandle(quizid : any) {
      localStorage.setItem('state' , quizid);
      dispatch(setState(true));
      window.location.href = '/workshop/quizMake';
  }

  function createNewHandle() {
    localStorage.setItem('state' , '');
    dispatch(setState(false));
    window.location.href = '/workshop/quizMake';
  }


  async function handleDelete(quizid : any) {
    const load = toast.loading('Deleting Quiz...');
    try {
      const response = await axios.delete
      (import.meta.env.VITE_API_URL + `/quiz/deleteQuiz/${quizid}`,
       {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.data.success === true) {
        toast.success('Quiz Deleted Successfully');
        await refetchUser();
        setDeleteId('');
      }
    }
    catch(err) {
      console.log(err);
    }
    finally {
      toast.dismiss(load);
    }
  }

  return (
    <>
    <Navbar />
    <div>
      <div className="w-[80%] mx-auto mt-[150px]">
        
        <div className="flex flex-col lg:flex-row justify-between">

          <div className="flex flex-col gap-5">
            <h1 className="text-6xl font-bold"> Workshop </h1>
            <h2 className="text-2xl">Create your own Quiz's and share it with your friend's!!</h2>
          </div>

            <div onClick={createNewHandle} className="flex justify-center mt-6 lg:mt-0 lg:justify-start">
              <div className="rounded-2xl bg-black w-[200px] h-[60px] text-xl text-white flex
                justify-center items-center border-2 border-black hover:border-black cursor-pointer
                hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                >
                  Create New
              </div>
            </div>

        </div>

        <div className="h-[1px] bg-black mt-2" />

        <div className="grid grid-cols-1 mt-4 md:grid-col-2 lg:grid-cols-3 justify-evenly lg:ml-14 gap-y-20 mb-10">

          {
            user?.quizes?.map((quiz, index) => (
              <Card key={index} quiz={quiz} type='workshop' editHandle={() => editHandle(quiz._id)} 
                handleDelete={() => setDeleteId(quiz._id)}/>
            ))
          }


        </div>
          {
            user?.quizes?.length === 0 && (
              <div>
                <h1 className="text-2xl font-bold text-center">No Quiz's Created 🧐</h1>
              </div>
            )
          }

      </div>
    </div>


    {
    deleteId !== '' && 
    (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
      <div className="w-[28%]  bg-slate-400 border-2 border-black flex flex-col rounded-lg">
        <h1 className="text-black font-bold text-3xl p-4">
          You sure you want to Delete?
        </h1>
  
        <div className="flex flex-row gap-3 justify-evenly mt-7 text-xl mb-5">
          <button onClick={()=> handleDelete(deleteId)} className="w-[130px] h-[50px] bg-black text-white hover:scale-110 transition-all duration-200 ease-in-out rounded-lg">
            Delete
          </button>
          <button
            onClick={() => setDeleteId('')}
            className="w-[130px] h-[50px] bg-black text-white hover:scale-110 transition-all duration-200 ease-in-out rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    )
  }
    </>
  )
}

export default Workshop