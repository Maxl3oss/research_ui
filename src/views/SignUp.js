import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'services/AuthService';
import Swal from 'sweetalert2';

export default function SignUp() {
   const navigate = useNavigate();
   const userRef = useRef();
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
      if (email === "" || fname === "" || lname === "" || pass === "" || conPass === "") {
         setErrMsg("Please complete this form.");
      } else if (pass !== conPass) {
         setErrMsg("Passwords do not match.")
      } else {
         SignUp();
      }
   }
   const SignUp = async (e) => {
      const response = await axios({
         url: "/user/signUp",
         method: "post",
         data: {
            email: email,
            pass: pass,
            fname: fname,
            lname: lname,
         },
      }).catch((err) => {
         if (err.response.data.message.code === "ER_DUP_ENTRY") {
            setErrMsg("This email already exists.");
         }
         // console.log(err);
         // setErrMsg(err.response.data.message);
      });
      if (response?.status === 200) {
         Swal.fire({
            icon: 'success',
            title: 'Sign Up Success',
            text: 'Please check your email!',
            footer: '<a href="https://mail.google.com/mail">go to google mail?</a>'
         }).then(() => {
            navigate("/signIn");
         })
      }
   }

   return (
      <div className="flex h-screen bg-slate-300">
         <div className="mx-auto mt-40 sm:m-auto">
            <div
               className="w-80 md:w-96 shadow-xl bg-white border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
               <form className="space-y-6" action="#">
                  <h3 className="text-xl font-medium text-center text-gray-900 dark:text-white">
                     Sign Up
                  </h3>
                  <div className="flex">
                     <div className="mr-1">
                        <label htmlFor="fname" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                           First name
                        </label>
                        <input
                           ref={userRef}
                           onChange={(e) => {
                              setFname(e.target.value);
                              setErrMsg("");
                           }}
                           type="text" name="fname" id="fname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                     </div>
                     <div className="ml-1">
                        <label htmlFor="lname" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                           Last name
                        </label>
                        <input
                           ref={userRef}
                           onChange={(e) => {
                              setLname(e.target.value);
                              setErrMsg("");
                           }}
                           type="text" name="lname" id="lname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                     </div>
                  </div>
                  <div>
                     <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                        Email
                     </label>
                     <input
                        ref={userRef}
                        onChange={(e) => {
                           setEmail(e.target.value);
                           setErrMsg("");
                        }}
                        type="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name123@company.com"
                     />
                  </div>
                  <div>
                     <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                        Passwords
                     </label>
                     <input
                        ref={userRef}
                        onChange={(e) => {
                           setPass(e.target.value);
                           setErrMsg("");
                        }}
                        type="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                     />
                  </div>
                  <div>
                     <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                        Confirm passwords
                     </label>
                     <input
                        ref={userRef}
                        onChange={(e) => {
                           setConPass(e.target.value);
                           setErrMsg("");
                        }}
                        type="password" name="conPass" id="conPass" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                     />
                  </div>
                  {errMsg !== "" && (
                     <>
                        <div className="flex mt-2">
                           <div className="bg-red-200 text-red-700 rounded-full p-1 fill-current">
                              <svg className="w-4 h-4 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12" />
                              </svg>
                           </div>
                           <span className="font-medium text-sm ml-3 text-red-700" x-text={errMsg}>{errMsg}</span>
                        </div>
                     </>
                  )}
                  <button type="submit" onClick={onSubmit} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign In to your account</button>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                     Registered?
                     <Link to="/signIn" className="text-blue-700 hover:underline dark:text-blue-500">
                        Sign In
                     </Link>
                  </div>
               </form>
            </div>
         </div>
      </div >
   )
}
