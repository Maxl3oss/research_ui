import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from 'images/Profile.jpg';
import logo from 'images/iconscout_logo.ico';

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
            <div className="flex justify-center w-full"></div>
            <div className="flex whitespace-nowrap items-center px-10 w-fit">
               <img className="rounded-full w-6 h-6 md:w-8 md:h-8" src={Profile} alt="" />
               <p className="ml-2 text-xs md:text-sm">{userInfo?.user_fname} </p>
               <p className="ml-1 text-xs md:text-sm">{userInfo?.user_lname}</p>
            </div>
         </div>
      </div>
   )
}
