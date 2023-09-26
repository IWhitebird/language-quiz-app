import { useState } from "react";
import axios from "axios";
import OtpInput from "react-otp-input";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";

const Register = () => {
    
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const [otpModal, setOtpModal] = useState<boolean>(false);

  async function submitHandler(e: any) {
    e?.preventDefault();
    let loading = toast.loading("Sending OTP");
    if (!username || !firstName || !lastName || !email || !password) {
      setFormError("All fields are required.");
      return;
    }
    try {
      const otpSend = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/sendOTP",
        {
          email: email,
        },
        {
          withCredentials: true,
        }
      );

      if (!otpSend.data.success) {
        setFormError(
          "Server side error in otp send or check your email please"
        );
        toast.dismiss(loading);
        return;
      }
      toast.dismiss(loading);
      toast.success("OTP sent");
      setOtpModal(true);
    } catch (err) {
      console.log(err);
      toast.dismiss(loading);
      toast.error("Something went wrong");
    }
  }

  async function submitOtpHandler() {
    let loading = toast.loading("Verifying OTP");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/register",
        {
          username: username,
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          otp: otp,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        toast.dismiss(loading);
        toast.error(response.data.message);
      }
      toast.dismiss(loading);
      toast.success("Registered successfully");
      window.location.href = "/login";
    } catch (err) {
      toast.dismiss(loading);
      toast.error("Something went wrong");
      console.log(err);
    }
    setOtpModal(false);
  }

  return (
    <>
    <Link to="/home" className="z-50 absolute left-[5.5rem] top-[2.3rem] text-4xl hover:-translate-x-4 hover:scale-110
        transition-all duration-200 ease-in-out">
      <BiArrowBack />
    </Link>
      <div className="min-h-screen bg-gray-100 py-10 flex flex-col justify-center sm:py-8 ">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-lg border-2 border-black lg:scale-125 sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-4xl mb-4 font-semibold">Register</h1>
              </div>
              <form onSubmit={submitHandler}>
                <div className="divide-y divide-gray-200">
                  <div className="py-4 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div className="relative mb-5">
                      <input
                        autoComplete="off"
                        id="username"
                        name="username"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                         text-gray-900 focus:outline-none focus:border-black"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <label
                        htmlFor="username"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base 
                        peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5
                         peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Username
                      </label>
                    </div>
                    <div className="relative mb-5">
                      <input
                        autoComplete="off"
                        id="firstName"
                        name="firstName"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900
                         focus:outline-none focus:border-black"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <label
                        htmlFor="firstName"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base
                         peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5
                          peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        First Name
                      </label>
                    </div>
                    <div className="relative mb-5">
                      <input
                        autoComplete="off"
                        id="lastName"
                        name="lastName"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                         text-gray-900 focus:outline-none focus:border-black"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <label
                        htmlFor="lastName"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base 
                        peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5
                         peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Last Name
                      </label>
                    </div>
                    <div className="relative mb-5">
                      <input
                        autoComplete="off"
                        id="email"
                        name="email"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                         text-gray-900 focus:outline-none focus:border-black"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base 
                        peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5
                         peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Email
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="password"
                        name="password"
                        type="password"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 
                        focus:outline-none focus:border-black"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label
                        htmlFor="password"
                        className="absolute left-0 -top-3.5 text-gray-600
                         text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 
                         transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <button
                        type="submit"
                        className="hover:scale-105 w-[120px] mt-2 max-h-[80px] bg-white text-xl sm:text-lg font-bold
                        text-black border-4 border-black  hover:bg-black hover:text-white 
                        transition duration-300 ease-in-out"
                      >
                        Register
                      </button>
                      <Link to="/login">
                        <p className=" text-blue-600  text-Nuni mt-4 transition-all duration-200 ease-in-out hover:text-blue-400">
                          already have an account?
                        </p>
                      </Link>
                    </div>
                    {formError && <p className="text-red-500">{formError}</p>}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {otpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="fixed inset-0 bg-black opacity-40  backdrop-blur-md"></div>
          <div className="relative bg-white p-4 md:p-8 rounded-lg shadow-lg text-center">
            <div className="flex justify-between">
              <h2 className="mx-auto text-2xl md:text-3xl font-semibold mb-4">
                Enter OTP
              </h2>
              <button
                onClick={() => setOtpModal(false)}
                className="text-2xl text-black hover:text-gray-600 focus:outline-none mb-5"
              >
                <AiFillCloseCircle />
              </button>
            </div>

            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span> </span>}
              renderInput={(props: any) => (
                <input
                  {...props}
                  placeholder="."
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="text-4xl w-12 md:w-16 lg:w-20 h-12 md:h-16 lg:h-20 border-0 
                  bg-[#e7e7e773] rounded-[0.5rem] aspect-square text-center focus:border-1
                   focus:outline-2 focus:outline-black"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <div className="flex gap-5 justify-start mt-4">
              <div></div>
              <button
                onClick={submitOtpHandler}
                className="hover:scale-105 w-[120px] mt-2 max-h-[80px] bg-white text-xl sm:text-lg font-bold
                text-black border-4 border-black  hover:bg-black hover:text-white 
                transition duration-300 ease-in-out"
              >
                Submit
              </button>
              <button
                onClick={submitHandler}
                className="hover:scale-105 w-[120px] mt-2 max-h-[80px] bg-white text-xl sm:text-lg font-bold
                text-black border-4 border-black  hover:bg-black hover:text-white 
                transition duration-300 ease-in-out"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
