import React, { useState, useEffect, useContext } from "react";
import Layout from "layouts/FrontendLayout";
import MyResearch from "./MyResearch";
import ImageProfile from "images/Profile.jpg";
import axios from "services/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// context
import { AuthContext } from "context/AuthProvider";

const Profile = () => {
   const context = useContext(AuthContext);
   const [isSuccess, setIsSuccess] = useState(false);
   const [errMsg, setErrMsg] = useState("");
   const [userInfo, setUserInfo] = useState({
      user_id: "",
      user_fname: "",
      user_lname: "",
      user_email: "",
      role_id: "",
      user_pass: "",
      confirm_pass: ""
   });
   const [showEdit, setShowEdit] = useState(false);
   const [changePass, setChangPass] = useState(false);
   const navigate = useNavigate();

   const signOut = async () => {
      try {
         await axios({
            method: "post",
            headers: { Authorization: localStorage.getItem('token').split(/["]/g).join("") },
            url: "/auth/signOut",
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

   const submitEditProfile = async (e) => {
      e.preventDefault();
      checkFormEditProfile();
   }

   useEffect(() => {
      if (errMsg === "" && isSuccess) {
         axios({
            method: "post",
            headers: { Authorization: localStorage.getItem('token').split(/["]/g).join("") },
            url: "/users/edit",
            data: userInfo
         }).then(() => {
            Swal.fire({
               icon: 'success',
               text: 'Successfully',
               showConfirmButton: false,
               timer: 1000
            }).then(async () => {
               await axios({
                  method: "post",
                  headers: { Authorization: localStorage.getItem('token').split(/["]/g).join("") },
                  url: "/users/getByEmail",
                  data: { user_email: userInfo.user_email }
               }).then((res) => {
                  localStorage.setItem('user', JSON.stringify(res.data.data[0]));
                  setShowEdit(false);
               })
            });
            setIsSuccess(false);
         }).catch((err) => {
            console.log(err);
         });
      }
   }, [errMsg, isSuccess, userInfo]);

   const checkFormEditProfile = () => {
      if (userInfo.user_fname === "" || userInfo.user_lname === "") {
         setErrMsg("Name can’t be blank");
         setIsSuccess(false);
         return
      }
      if (changePass && userInfo.user_pass !== userInfo.confirm_pass) {
         setErrMsg("Passwords do not match");
         setIsSuccess(false);
         return
      }
      setIsSuccess(true);
      setErrMsg("");
   }

   const handleEdit = () => {
      showEdit ? setShowEdit(false) : setShowEdit(true);
   }

   const handleChangeEdit = () => {
      setUserInfo(current => {
         return {
            ...current, user_pass: "", confirm_pass: ""
         }
      })
      changePass ? setChangPass(false) : setChangPass(true);
   }

   useEffect(() => {
      if (context.Profile) {
         // const Info = JSON.parse(localStorage.getItem("user"));
         const Info = context.Profile;
         // console.log(Info.user_id);
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
   }, [context]);

   useEffect(() => {
      if (showEdit) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'unset';
      }
   }, [showEdit])

   return (
      <>
         <Layout>
            <div className="min:h-screen mt-8 relative">
               <div className="md:pr-10  mb-10">
                  <div className="flex flex-col justify-center items-center">
                     <div className="flex justify-center items-center">
                        <span className="text-2xl">Profile</span>
                        {/* Edit */}
                        <div onClick={handleEdit} className="text-yellow-600 bg-yellow-50 rounded-full px-2 flex cursor-pointer">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                           </svg>
                           Edit
                        </div>
                     </div>

                     <div className="h-28 w-28 md:h-fit md:w-fit rounded-full bg-slate-400 ">
                        <img alt="" src={ImageProfile} />
                     </div>
                     <div className={`${userInfo?.role_id === 2 && "bg-green-50 text-green-600"} + ${userInfo?.role_id === 1 && "bg-blue-50 text-blue-600"} +" px-2 text-sm rounded-full"`}>
                        {userInfo?.role_id === 2 && "User"}{userInfo?.role_id === 1 && "Admin"}
                     </div>
                     <div className="mt-2 text-sm md:text-2xl">
                        {userInfo?.user_fname} {userInfo?.user_lname}
                     </div>
                     <div>
                        {userInfo?.user_email}
                     </div>
                  </div>
                  {/* Sign Out */}
                  <div className="md:hidden mt-3 flex justify-center items-end text-xs cursor-pointer">
                     <button onClick={signOut} className="ml-2 flex justify-center items-center py-2 pr-4 pl-3 text-red-700 bg-red-50 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        <span className="ml-1">Sign Out</span>
                     </button>
                  </div>
               </div>

               <hr />
               <MyResearch />
            </div>
         </Layout>

         {/* edit profile */}
         <div className={`${!showEdit && "hidden"}`} >
            <div className="absolute z-50 top-0 left-0 h-full bg-opacity-50 w-full bg-gray-900">
               <div className="flex justify-center items-center h-screen text-gray-600">
                  <div className="bg-white rounded h-full md:h-3/4 w-full md:w-[600px] block">
                     <div className="flex p-2 items-center">
                        {/* close */}
                        <div onClick={handleEdit} className="text-2xl w-[62] p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </div>
                        <div className="flex w-full justify-center">
                           <span className="text-lg">
                              Edit Profile
                           </span>
                        </div>
                        <div>
                           <button onClick={submitEditProfile} className="bg-blue-600 hover:bg-blue-500 w-[62] text-blue-50 rounded-full text-sm py-2 px-4 shadow-sm">
                              Save
                           </button>
                        </div>
                     </div>
                     <div className="h-5/6 overflow-y-auto">
                        <div className="flex flex-col justify-center items-center ">
                           {/* err message */}
                           <div className={`${errMsg === "" ? "hidden" : "flex justify-center w-full"}`}>
                              <span className="text-red-600 bg-red-100 w-4/5 flex justify-center rounded py-2 px-5">{errMsg}</span>
                           </div>
                           <div className="h-28 w-28 md:h-fit md:w-fit rounded-full bg-slate-400 ">
                              <img alt="" src={ImageProfile} />
                           </div>
                           <div>{userInfo?.user_email}</div>
                           <div className="w-5/6 p-2">
                              <span>First Name</span>
                              <input value={userInfo.user_fname}
                                 onChange={e => setUserInfo(current => {
                                    return {
                                       ...current, user_fname: e.target.value
                                    }
                                 })}
                                 className="py-2 px-4 w-full h-10 rounded-full bottom-2 border focus:outline-none focus:border-blue-600 focus:ring-blue-600 focus:ring-1" />
                           </div>
                           <div className="w-5/6 p-2">
                              <span>Last Name</span>
                              <input value={userInfo.user_lname}
                                 onChange={e => setUserInfo(current => {
                                    return {
                                       ...current, user_lname: e.target.value
                                    }
                                 })}
                                 className="py-2 px-4 w-full h-10 rounded-full bottom-2 border focus:outline-none focus:border-blue-600 focus:ring-blue-600 focus:ring-1" />
                           </div>
                           {/* password */}
                           <div className={`${!changePass && "hidden"} " w-5/6 p-2"`}>
                              <span>Password</span>
                              <input placeholder="*********" type="password"
                                 onChange={e => setUserInfo(current => {
                                    return {
                                       ...current, user_pass: e.target.value
                                    }
                                 })}
                                 className="py-2 px-4 w-full h-10 rounded-full bottom-2 border focus:outline-none focus:border-blue-600 focus:ring-blue-600 focus:ring-1" />
                           </div>
                           <div className={`${!changePass && "hidden"} " w-5/6 p-2"`}>
                              <span>confirm Password</span>
                              <input placeholder="*********" type="password"
                                 onChange={e => setUserInfo(current => {
                                    return {
                                       ...current, confirm_pass: e.target.value
                                    }
                                 })}
                                 className="py-2 px-4 w-full h-10 rounded-full bottom-2 border focus:outline-none focus:border-blue-600 focus:ring-blue-600 focus:ring-1" />
                           </div>

                           <div onClick={handleChangeEdit} className="mt-3 text-blue-600 bg-blue-50 rounded-full py-2 px-4 cursor-pointer">
                              <span className={`${changePass && "hidden"}`}>Change Password?</span>
                              <span className={`${!changePass && "hidden"}`}>No Change</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </>
   )
}

export default Profile