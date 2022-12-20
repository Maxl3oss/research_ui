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
         <div className="flex w-full">
            <div className="flex justify-center w-full"></div>
            <div className="flex items-center px-10 w-fit">
               <img className="rounded-full w-8 h-8" src={Profile} alt="" />
               <p className="ml-2 text-sm">{userInfo?.user_fname} </p>
               <p className="ml-1">{userInfo?.user_lname}</p>
            </div>
         </div>
      </div>
   )
}
