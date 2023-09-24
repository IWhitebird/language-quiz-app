import  { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [selected, setSelected] = useState('Profile');

  console.log(user)

  return (
    <div className="flex gap-7 h-screen">

      <div className="w-1/4 bg-gray-200 p-4 flex flex-col gap-5">

        <div className="mb-4">
          <img
            src={user?.image}
            alt="User Profile"
            className="w-16 h-16 rounded-full mx-auto"
          />
          <p className="text-center mt-2 text-3xl">{user?.firstName} {user?.lastName}</p>
        </div>

        <div onClick={() => setSelected('Profile')} className={`hover:bg-slate-200 transition-all duration-200 ease-in-out 
        cursor-pointer border-2 border-black rounded-lg p-5 text-xl hover:scale-105
        ${selected === 'Profile' ? 'bg-slate-400' : ''}`}>
          <h2 className="font-semibold">Profile</h2>
        </div>
        
        
        <div onClick={() => setSelected('Past')} className={`hover:bg-slate-200 transition-all duration-200 ease-in-out 
        cursor-pointer border-2 border-black rounded-lg p-5 text-xl hover:scale-105
        ${selected === 'Past' ? 'bg-slate-400' : ''}`}>
          <h2 className="font-semibold">Past Quizzes</h2>
        </div>
        
        <div onClick={() => setSelected('Logout')} className={`hover:bg-slate-200 transition-all duration-200 ease-in-out 
        cursor-pointer border-2 border-black rounded-lg p-5 text-xl hover:scale-105
        ${selected === 'Logout' ? 'bg-slate-400' : ''}`}>
          <h2 className="font-semibold">Logout</h2>
        </div>

      </div>
      

      <div className="w-3/4 p-4">
        {
          selected === 'Profile' && (
          <div>
              
          </div>
          )
        }

        {
          selected === 'Past' && (
          <div>



          </div>
          )
        }

        {
          selected === 'Logout' && (
          <div>

          </div>
          )
        }
      </div>
    </div>
  );
};

export default Dashboard;
