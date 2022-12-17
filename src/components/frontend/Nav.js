import { SearchContext } from 'context/SearchProvider';
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Nav() {
   const navigate = useNavigate();
   const typeFilter = ['all', 'creator', 'title', 'description', 'subject', 'rights'];
   const [popOverShow, setPopOverShow] = useState(false);
   const context = useContext(SearchContext);
   let { user_email } = {};

   localStorage.getItem("user") ? { user_email } = JSON.parse(localStorage.getItem("user")) : { user_email } = false;

   const popOverFn = () => {
      popOverShow ? setPopOverShow(false) : setPopOverShow(true);
   }
   const popOverClose = () => {
      setPopOverShow(false);
   }

   const changeSearchType = (e) => {
      context.updateType(e.target.textContent);
      popOverFn();
      // console.log(e.target.textContent);
   }

   const signOut = async () => {
      try {
         await axios({
            method: "post",
            headers: { Authorization: localStorage.getItem('token').split(/["]/g).join("") },
            url: "/api/user/signOut",
         }).then((res) => {
            Swal.fire({
               icon: 'success',
               text: 'Successfully sign out.',
               showConfirmButton: false,
               timer: 1000
            }).then(() => {
               localStorage.removeItem("user");
               localStorage.removeItem("token");
               navigate("/signIn");
            });
         });
      } catch (err) {
         // console.log(err.response?.status === 403);
         if (err.response?.status === 403 || err.response?.status === 401) {
            Swal.fire({
               icon: 'success',
               text: 'Successfully sign out.',
               showConfirmButton: false,
            }).then(() => {
               localStorage.removeItem("user");
               localStorage.removeItem("token");
               navigate("/signIn");
            });
         }
      }
   }

   return (
      <nav className="fixed inset-x-0 top-0 z-50 bg-white border-gray-200 shadow px-0 sm:px-4 py-2.5 rounded dark:bg-gray-900">
         {/* props */}
         <div className="container flex items-center justify-around mx-auto">
            {/* logo */}
            <div onClick={() => navigate("/")} className="flex justify-start cursor-pointer">
               <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
               <span className="self-center md:text-xl font-semibold whitespace-nowrap dark:text-white">
                  Research
               </span>
            </div>
            {/* search bar */}
            <div className="flex flex-col w-3/5 md:w-3/5 focus:w-full">
               <div className="flex items-center w-full bg-white border rounded-full pr-3 py-1">
                  {/* type filter */}
                  {context.type && (
                     <div className="w-auto mr-1 flex justify-around ml-2 py-1 px-2 rounded-full border bg-gray-200 ">
                        <div className="">
                           {context.type}
                        </div>
                     </div>
                  )}
                  <input
                     type="text"
                     className="ml-3 w-full border-none focus:border-white focus:outline-none focus:ring focus:ring-white"
                     onChange={(e) => (
                        context.updateSearch(e.target.value)
                     )}
                     value={context.search}
                     placeholder="Search ..."
                  />
                  <button onClick={popOverFn}>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                     </svg>
                  </button>
               </div>
               <div className={`${!popOverShow ? "hidden" : "flex justify-center"}`}>
                  <div onMouseLeave={popOverClose} className="bg-white border-2 shadow-md w-9/12 md:w-3/6 top-16 md:right-auto right-5 h-96 absolute rounded-b-3xl transition-all">
                     <div className="m-5">
                        <span className="md:text-lg font-bold">Category</span>
                        <hr className="mb-3" />
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                           {typeFilter.map((item, key) => (
                              <div key={key}>
                                 <button className="px-2 hover:bg-gray-100 hover:border-gray-200 rounded-full border border-indigo-100"
                                    id={item} onClick={changeSearchType}>{item}
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="hidden w-full md:block md:w-auto " id="navbar-default">
               <ul className="flex flex-col justify-around p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                  <li className={!user_email ? "hidden" : ""}>
                     <button onClick={signOut} className="ml-2 flex justify-center items-center py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        <span className="ml-2">Sign Out</span>
                     </button>
                  </li>

                  <li className={user_email ? "hidden" : ""}>
                     <Link to="/signIn" className="ml-2 block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                        <div className="flex hover:text-blue-800">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                           </svg>
                           <span className="ml-2">Sign In</span>
                        </div>
                     </Link>
                  </li>
               </ul>
            </div>
         </div>
      </nav >
   )
}
