import React, { useState } from 'react';
import { Link } from "react-router-dom";

export default function Nav() {
   const typeFilter = ['all', 'title', 'creator', 'subject', 'institute'];
   const [popOverShow, setPopOverShow] = useState(false);

   const popOverFn = () => {
      popOverShow ? setPopOverShow(false) : setPopOverShow(true);
   }
   const test = () => {
      console.log("SS");
   }
   return (
      <nav className="sticky top-0 bg-white border-gray-200 shadow px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
         <div className="container flex items-center justify-around mx-auto">
            {/* logo */}
            <div className="flex justify-start">
               <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
               <span className="self-center md:text-xl font-semibold whitespace-nowrap dark:text-white">
                  Research
               </span>
            </div>
            {/* search bar */}
            <div className="flex flex-col w-1/2 md:w-3/5">
               <div>
                  <input
                     type="text"
                     className="w-full px-4 py-2 bg-white border rounded-full focus:border-blue-500 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                     placeholder="Search ..."
                  />
               </div>
               <div className={`${!popOverShow ? "hidden" : "flex justify-center"}`}>
                  <div className="bg-white border-gray-200 shadow-md border-0 w-9/12 md:w-3/6 top-16 md:top-20 h-96 absolute rounded-b-xl">
                     <div className="m-5">
                        <span className="md:text-lg font-bold">Filter</span>
                        <hr className="mb-3" />
                        <div className="grid grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                           {typeFilter.map((item, key) => (
                              <div key={key}>
                                 <button className="px-2 hover:bg-indigo-100 hover:border-indigo-400 rounded-full border-2 border-indigo-100"
                                    id={item} onClick={test}>{item}
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            {/* button */}
            <div className="block justify-end">
               <button onClick={popOverFn}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
               </button>
            </div>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
               <ul className="flex flex-col justify-around p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                  <li>
                     <Link className="h-8 w-8 md:hover:text-indigo-600" to="/" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                     </Link>
                  </li>
                  <li>
                     <Link to="/signIn" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-indigo-600 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                        Sign In
                     </Link>
                  </li>
               </ul>
            </div>
         </div>

      </nav >
   )
}
