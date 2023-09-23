import { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";

const Login = () => {

 const [email, setEmail] = useState<string>('');
 const [password, setPassword] = useState<string>('');
 const [formError, setFormError] = useState<string>('');

 const dispatch = useDispatch();

  async function submitHandler() {
    let toastId = toast.loading('Loading...');
    if(!email || !password) {
        setFormError('Please enter all fields');
        return;
        }
    try{
        const response = await axios.post(import.meta.env.VITE_API_URL  + '/auth/login',
            {
                email: email,
                password: password
            })

        if(response.statusText === 'OK') {
            toast.success('Logged in successfully');
            localStorage.setItem('token', response.data.token);
            dispatch(setUser(response.data.user));
            window.location.href = '/home';
        }
    }
    catch(err) {
      console.log(err);
    }
    finally {
      toast.dismiss(toastId);
    }
  }

  return (
    <>
      <div className=" min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-white shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg  sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-4xl font-semibold">
                  Login
                </h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative mb-5">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label
                      htmlFor="email"   
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      onClick={submitHandler}
                      className="hover:scale-105 w-[80px] max-h-[50px] bg-white text-xl sm:text-lg font-bold text-black border-4 border-black hover:border-white hover:bg-black hover:text-white transition duration-300 ease-in-out"
                    >
                      Login
                    </button>
                    <Link to="/SignUp">
                      <p className=" text-blue-600  text-Nuni mt-4 transition-all duration-200 ease-in-out hover:text-blue-400">
                        register your account?
                      </p>
                    </Link>
                  </div>
                  {formError && <p className="text-red-500">{formError}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
