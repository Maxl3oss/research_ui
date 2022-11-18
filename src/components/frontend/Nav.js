import { SearchContext } from 'App';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Nav() {
   const navigate = useNavigate();
   const userRef = useRef();
   const typeFilter = ['all', 'title', 'creator', 'subject', 'institute'];
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
   const clearSearchType = (e) => {
      context.updateType("");
   }

   const changeSearchType = (e) => {
      context.updateType(e.target.textContent);
      popOverFn();
      // console.log(e.target.textContent);
   }

   const signOut = async () => {
      localStorage.clear();
      await axios({
         method: "post",
         url: "/api/user/signOut",
      }).then(() => {
         Swal.fire({
            icon: 'success',
            title: 'Successfully sign out.',
         }).then(() => {
            navigate("/signIn");
         });
      });
   }

   useEffect(() => {
      userRef.current.focus();
   }, []);

   useEffect(() => {
      if (context.type === "" && context.search !== "") {
         Swal.fire({
            icon: 'warning',
            title: 'Please select a category to search!',
         }).then(() => {
            setPopOverShow(true);
         })
      }
   }, [context.type, context.search]);

   return (
      <nav className="sticky top-0 bg-white border-gray-200 shadow px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
         {/* props */}
         <div className="container flex items-center justify-around mx-auto">
            {/* logo */}
            <div className="flex justify-start">
               <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
               <span className="self-center md:text-xl font-semibold whitespace-nowrap dark:text-white">
                  Research
               </span>
            </div>
            {/* search bar */}
            <div className="flex flex-col w-3/5 md:w-3/5">
               <div className="flex items-center w-full bg-white border rounded-full pr-3 py-1">
                  {/* type filter */}
                  {context.type && (
                     <div className="w-auto mr-1 flex justify-around ml-2 py-1 px-2 rounded-full border bg-gray-200 ">
                        <div className="">
                           {context.type}
                        </div>
                        <div className="ml-1 flex items-center">
                           <button onClick={clearSearchType}>
                              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                           </button>
                        </div>
                     </div>
                  )}
                  <input
                     type="text"
                     className="ml-3 w-full border-none focus:border-white focus:outline-none focus:ring focus:ring-white"
                     ref={userRef}
                     onChange={(e) => (
                        context.updateSearch(e.target.value)
                     )}
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
                  <li>
                     <Link className="h-8 w-8 md:hover:text-blue-600" to="/" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                     </Link>
                  </li>
                  <li className={!user_email ? "hidden" : ""}>
                     <button onClick={signOut} className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                        Sign Out
                     </button>
                  </li>
                  <li className={user_email ? "hidden" : ""}>
                     <Link to="/signIn" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                        Sign In
                     </Link>
                  </li>
               </ul>
            </div>
         </div>
      </nav >
   )
}
