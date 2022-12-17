import React, { useState, useEffect } from 'react'
import Layout from "layouts/FrontendLayout";
import MyResearch from './MyResearch';
import ImageProfile from "images/Profile.jpg";

const Profile = () => {

   const [userInfo, setUserInfo] = useState();

   useEffect(() => {
      if (localStorage.getItem("user")) {
         const Info = JSON.parse(localStorage.getItem("user"));
         setUserInfo(current => {
            return {
               ...current,
               user_id: Info.user_id,
               user_fname: Info.user_fname,
               user_lname: Info.user_lname,
               user_email: Info.user_email,
               role_id: Info.role_id
            }
         });

      }
   }, []);

   // useEffect(() => {
   //    // console.log(userInfo);
   // }, [userInfo]);

   return (
      <Layout>
         <div className="min:h-screen mt-8">
            <div className="md:pr-10  mb-10">
               <div className="flex justify-center">
                  <span className="text-2xl">Profile</span>
               </div>
               <div className="flex flex-col justify-center items-center">
                  <div className="h-28 w-28 md:h-fit md:w-fit rounded-full bg-slate-400 ">
                     <img alt="" src={ImageProfile} />
                  </div>
                  <div className={`${userInfo?.role_id === 2 && "bg-green-50 text-green-600"} + ${userInfo?.role_id === 1 && "bg-red-50 text-red-600"} +"px-2 text-sm rounded-full"`}>
                     {userInfo?.role_id === 2 && "User"}{userInfo?.role_id === 1 && "Admin"}
                  </div>
                  <div className="text-sm md:text-2xl">
                     {userInfo?.user_fname} {userInfo?.user_lname}
                  </div>
                  <div className="">
                     {userInfo?.user_email}
                  </div>
               </div>
            </div>

            <hr />
            <MyResearch />
         </div>
      </Layout >
   )
}

export default Profile