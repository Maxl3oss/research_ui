import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from 'images/Profile.jpg';

export default function Nav() {
   const [userInfo, setUserInfo] = useState();
   const navigate = useNavigate();

   useEffect(() => {
      if (JSON.parse(localStorage.getItem("user"))) {
         setUserInfo(JSON.parse(localStorage.getItem("user")));
      } else {
         navigate("/signIn");
      }
   }, [navigate]);

   return (
      <div className="bg-dark w-full nav">
         <div className="flex justify-end w-full">
            <div className="flex justify-center w-full">
            </div>
            <div onClick={() => navigate("/")} className="flex items-center justify-end cursor-pointer">
               <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
               </svg>
            </div>
            <div onClick={() => navigate("/profile")} className="flex whitespace-nowrap cursor-pointer items-center ml-3 pr-10 w-fit">
               <img className="rounded-full w-6 h-6 md:w-8 md:h-8" src={Profile} alt="" />
               <p className="ml-2 text-xs md:text-sm">{userInfo?.user_fname} </p>
               <p className="ml-1 text-xs md:text-sm">{userInfo?.user_lname}</p>
            </div>
         </div>
      </div>
   )
}
