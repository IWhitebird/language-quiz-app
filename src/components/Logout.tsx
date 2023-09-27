import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { deleteUser } from '../slices/userSlice';

const Logout = (props : any) => {

    const dispatch = useDispatch<any>();

    async function logoutHandle() {
        const loadingtoast = toast.loading('Logging out...');
        try{
          localStorage.removeItem('token');
          dispatch(deleteUser());
          toast.success('Logged out!', {id: loadingtoast});
          window.location.href = '/';
        }
        catch(err){
          toast.error('Try Again', {id: loadingtoast});
          console.log(err);
        }
      }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
    <div className="lg:w-[28%] w-[90%] bg-slate-400 border-2 border-black flex flex-col rounded-lg">
      <h1 className="text-black font-bold text-3xl p-4">
        Are you sure you want to logout?
      </h1>

      <div className="flex flex-row gap-3 justify-evenly mt-7 text-xl mb-5">
        <button onClick={logoutHandle} className="w-[130px] h-[50px] bg-black text-white hover:scale-110 transition-all duration-200 ease-in-out rounded-lg">
          Logout
        </button>
        <button
          onClick={() => props.fun(props.val)}
          className="w-[130px] h-[50px] bg-black text-white hover:scale-110 transition-all duration-200 ease-in-out rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  )
}

export default Logout