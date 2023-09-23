import { useSelector } from 'react-redux';
import { RootState } from '../reducer';
import { FiLogOut } from 'react-icons/fi';
import { IoMdSettings } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { BiHomeAlt } from 'react-icons/bi';

const Navbar = () => {
  const { user, logged } = useSelector((state: RootState) => state.user);

  console.log("myuser", user);

  return (
    <div>
      {logged ? (
        <div className='absolute w-full z-10'>
          <div className=' w-[80%] text-3xl items-center bg-black mx-auto h-[50px] mt-5 rounded-[15px] text-white flex justify-between p-8'>
            <div className='flex flex-row items-center gap-10 h-full'>
              <img src={user?.image} alt="avatar" className='hover:scale-125 w-[40px] h-[40px] rounded-[15px] transition-all ease-in-out duration-300 '/>
              <h1 className='hidden lg:block transition-all ease-in-out duration-300 hover:scale-125 hover:text-green-500 hover:font-bold text-transparent bg-clip-text text-white'>{user?.username}</h1>
            </div>
            <div className='hidden lg:block hover:scale-125 hover:text-cyan-500 transition-all ease-in-out duration-300'>
              <h1>Play quiz of the Day!! 🎉</h1>
            </div>
            <div className='flex items-center gap-4'>
              <Link to='/'>
                <div className='hover:scale-125 hover:text-green-600 transition-all ease-in-out duration-300'>
                  <BiHomeAlt />
                </div>
              </Link>
              <div className='hover:scale-125 hover:text-gray-700 hover:rotate-180 transition-all ease-in-out duration-300'>
                <IoMdSettings />
              </div>
              <div className='hover:scale-125 hover:text-red-600 hover:translate-x-3 transition-all ease-in-out duration-300' >
                <FiLogOut /> 
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='absolute w-full z-10'>
        <div className=' w-[80%] text-3xl items-center bg-black mx-auto h-[50px] mt-5 rounded-[15px] text-white flex justify-between p-8'>
          <div className='hidden lg:block hover:scale-125 hover:text-cyan-500 transition-all ease-in-out duration-300'>
            <h1>Register Today to learn & Compete for awesome prizes!! 🏆🏆</h1>
          </div>
          <div className='flex items-center gap-7'>
            <Link to='/'>
                <div className='hover:scale-125 hover:text-green-600 transition-all ease-in-out duration-300'>
                  <BiHomeAlt />
                </div>
              </Link>
            <Link to='/login'>
            <button className='hover:scale-125  transition-all ease-in-out duration-300'>
              Login
            </button>
            </Link>
            <Link to='/register'>
            <button className='hover:scale-125  transition-all ease-in-out duration-300' >
              Register
            </button>
            </Link>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Navbar;
