import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from 'context/AuthProvider';

const Sidebar = () => {
   const context = useContext(AuthContext);

   return (
      <aside className="inset-y-20 p-5 pr-0 h-96 sticky w-2/12 min-h-min md:inline hidden pb-0">
         <Link className="md:hover:text-blue-600" to="/">
            <div className="flex justify-center lg:justify-start lg:ml-20 items-center ">
               <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
               </svg>
               <span className="ml-2 text-sm md:hidden xl:inline-flex">Home</span>
            </div>
         </Link>

         <Link className="md:hover:text-blue-600" to="/profile">
            <div className="mt-5 flex justify-center lg:justify-start lg:ml-20 items-center ">
               <svg className="w-6 h-6" xmlns=" http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
               </svg>
               <span className="ml-2 text-sm md:hidden xl:inline-flex">Profile</span>
            </div>
         </Link>

         <Link className="md:hover:text-blue-600" to="/addResearch">
            <div className="mt-5 flex justify-center lg:justify-start lg:ml-20 items-center ">
               <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
               </svg>
               <span className="ml-2 text-sm md:hidden xl:inline-flex">Add Research</span>
            </div>
         </Link>

         {context.Profile?.user_role === 1 && (
            <Link className="md:hover:text-blue-600" to="/backend">
               <div className="mt-5 flex justify-center lg:justify-start lg:ml-20 items-center ">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                  </svg>
                  <span className="ml-2 text-sm md:hidden xl:inline-flex">backend</span>
               </div>
            </Link>
         )}

      </aside >
   )
}

export default Sidebar