import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "services/axios";
import Swal from "sweetalert2";

export default function SignUp() {
   const navigate = useNavigate();
   const userRef = useRef();
   const [loading, setLoading] = useState(false);
   const [email, setEmail] = useState("");
   const [pass, setPass] = useState("");
   const [conPass, setConPass] = useState("");
   const [fname, setFname] = useState("");
   const [lname, setLname] = useState("");
   const [errMsg, setErrMsg] = useState("");

   useEffect(() => {
      userRef.current.focus();
   }, []);

   const onSubmit = async (e) => {
      e.preventDefault();
      if (
         email === "" ||
         fname === "" ||
         lname === "" ||
         pass === "" ||
         conPass === ""
      ) {
         setErrMsg("Please complete this form");
      } else if (pass !== conPass) {
         setErrMsg("Passwords do not match");
      } else {
         SignUp();
      }
   };
   const SignUp = async (e) => {
      setLoading(true);
      try {
         const response = await axios({
            url: "/auth/signUp",
            method: "post",
            data: {
               email: email,
               pass: pass,
               fname: fname,
               lname: lname,
            },
         });
         if (response?.status === 200) {
            setLoading(false);
            Swal.fire({
               icon: "success",
               title: "Sign Up Success",
               text: "Please check your email!",
               confirmButtonColor: "rgb(29 78 216)",
               footer:
                  '<a href="https://mail.google.com/mail">go to google mail?</a>',
            }).then(() => {
               navigate("/signIn");
            });
         }
      } catch (err) {
         setLoading(false);
         if (err.response.data.message.code === "ER_DUP_ENTRY") {
            setErrMsg("This email already exists");
         }
         // console.log(err);
      }
   };

   return (
      <div className="flex h-screen bg-slate-300">
         <div className="mx-auto mt-40 sm:m-auto">
            <div className="relative w-80 md:w-96 shadow-xl bg-white border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
               {loading && (
                  <div className="flex absolute top-1/2 left-40">
                     <div role="status">
                        <svg
                           aria-hidden="true"
                           className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                           viewBox="0 0 100 101"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                           />
                           <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                           />
                        </svg>
                        <span className="sr-only">Loading...</span>
                     </div>
                  </div>
               )}
               <form className="space-y-6 " action="#">
                  <h3 className="text-xl font-medium text-center text-gray-900 dark:text-white">
                     Sign Up
                  </h3>
                  <div className="flex">
                     <div className="mr-1">
                        <label
                           htmlFor="fname"
                           className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
                        >
                           First name
                        </label>
                        <input
                           ref={userRef}
                           onChange={(e) => {
                              setFname(e.target.value);
                              setErrMsg("");
                           }}
                           type="text"
                           name="fname"
                           id="fname"
                           className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                     </div>
                     <div className="ml-1">
                        <label
                           htmlFor="lname"
                           className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
                        >
                           Last name
                        </label>
                        <input
                           onChange={(e) => {
                              setLname(e.target.value);
                              setErrMsg("");
                           }}
                           type="text"
                           name="lname"
                           id="lname"
                           className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                     </div>
                  </div>
                  <div>
                     <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
                     >
                        Email
                     </label>
                     <input
                        onChange={(e) => {
                           setEmail(e.target.value);
                           setErrMsg("");
                        }}
                        type="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="name123@company.com"
                     />
                  </div>
                  <div>
                     <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                        Passwords
                     </label>
                     <input
                        onChange={(e) => {
                           setPass(e.target.value);
                           setErrMsg("");
                        }}
                        type="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                     />
                  </div>
                  <div>
                     <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                        Confirm passwords
                     </label>
                     <input
                        onChange={(e) => {
                           setConPass(e.target.value);
                           setErrMsg("");
                        }}
                        type="password"
                        name="conPass"
                        id="conPass"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                     />
                  </div>
                  {errMsg !== "" && (
                     <>
                        <div className="flex mt-2">
                           <div className="bg-red-200 text-red-700 rounded-full p-1 fill-current">
                              <svg
                                 className="w-4 h-4 "
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                 />
                              </svg>
                           </div>
                           <span
                              className="font-medium text-sm ml-3 text-red-700"
                              x-text={errMsg}
                           >
                              {errMsg}
                           </span>
                        </div>
                     </>
                  )}
                  <button
                     type="submit"
                     onClick={onSubmit}
                     className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                     Sign In to your account
                  </button>

                  <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                     Registered?
                     <Link
                        to="/signIn"
                        className="text-blue-700 hover:underline dark:text-blue-500"
                     >
                        Sign In
                     </Link>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}
