import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'services/axios';
import Swal from "sweetalert2";
import { AuthContext } from 'context/AuthProvider';

export default function SignIn() {
   const navigate = useNavigate();
   const userRef = useRef();
   const [email, setEmail] = useState("");
   const [remember, setRemember] = useState();
   const [pass, setPass] = useState("");
   const [errMsg, setErrMsg] = useState("");
   const context = useContext(AuthContext);

   const onSubmit = async (e) => {
      e.preventDefault();
      if (email === "" || pass === "") {
         setErrMsg("Please complete this form.");
      }
      else {
         SignIn();
      }
   }

   const SignIn = async () => {
      await axios.post("/auth/signIn", {
         email: email,
         pass: pass,
      }).then((res) => {
         if (res?.status === 200) {
            localStorage.setItem('user', JSON.stringify(res.data.data[0]));
            localStorage.setItem('token', JSON.stringify(res.data.token));
            Swal.fire({
               position: 'center',
               icon: 'success',
               text: 'Successfully sign in.',
               showConfirmButton: false,
               timer: 1000
            });
            onClickRemember();
            if (remember) localStorage.setItem('remember', JSON.stringify({ email: email, pass: pass, remember: true }));
            // update context
            context.update();
            navigate("/");
         }
      }).catch((err) => {
         setErrMsg(err.response.data.message);
      });
   }

   const onClickRemember = () => {
      remember ? setRemember(false) : setRemember(true);
   }

   useEffect(() => {
      userRef.current.focus();
   }, []);

   useEffect(() => {
      if (localStorage.getItem('remember')) {
         let data = JSON.parse(localStorage.getItem('remember'));
         setEmail(data.email);
         setPass(data.pass);
         setRemember(data.remember);
      }
   }, []);

   return (
      <div className="flex h-screen bg-slate-300">
         <div className="mx-auto mt-40 sm:m-auto">
            <div
               className="w-80 md:w-96 shadow-xl bg-white border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
               <form className="space-y-6" action="#">
                  <h3 className="text-xl font-medium text-center text-gray-900 dark:text-white">
                     Sign in
                  </h3>
                  <div>
                     <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                        Your email
                     </label>
                     <input
                        ref={userRef}
                        value={email}
                        onChange={(e) => {
                           setEmail(e.target.value);
                           setErrMsg("");
                        }}
                        type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name123@company.com"
                     />
                  </div>
                  <div>
                     <label htmlFor="password" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                        Your password
                     </label>
                     <input
                        onChange={(e) => {
                           setPass(e.target.value);
                           setErrMsg("");
                        }}
                        value={pass}
                        type="password" name="password" id="password" placeholder="• • • • • • • •" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                           <span className="font-medium text-sm ml-3 text-red-700" >{errMsg}</span>
                        </div>
                     </>
                  )}
                  <div className="flex items-start">
                     <div className="flex items-start">
                        <div className="flex items-center h-5">
                           <input id="remember" type="checkbox" className="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required=""
                              defaultChecked={remember}
                              onClick={onClickRemember}
                           />
                        </div>
                        <div className="text-sm ml-3">
                           <label htmlFor="remember" className="font-medium text-gray-900 dark:text-gray-300">
                              Remember me
                           </label>
                        </div>
                     </div>
                     <span className="text-sm text-blue-700 hover:underline ml-auto dark:text-blue-500">
                        Lost Password?
                     </span>
                  </div>
                  <button type="submit" onClick={onSubmit} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring-opacity-40 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign In to your account</button>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                     Not registered?
                     <Link to="/signUp" className="text-blue-700 hover:underline dark:text-blue-500">Create
                        account
                     </Link>
                  </div>
               </form>
            </div>
         </div>
      </div >
   )
}
