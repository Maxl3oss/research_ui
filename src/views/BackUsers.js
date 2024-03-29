import React, { useEffect, useState } from 'react';
import Layout from 'layouts/BackendLayout';
import axios from 'services/axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import ImageProfile from "images/Profile.jpg";

const BackUsers = () => {
   const [usersInfo, setUsersInfo] = useState();
   const [loading, setLoading] = useState(false);
   const [isSuccess, setIsSuccess] = useState(false);
   const navigate = useNavigate();
   const [errMsg, setErrMsg] = useState("");
   const [page, setPage] = useState(1);
   const [perPage] = useState(10);
   const [totalPage, setTotalPage] = useState("");
   const [changePass, setChangPass] = useState(false);
   const [showEdit, setShowEdit] = useState(false);
   const [userInfo, setUserInfo] = useState({
      user_id: "",
      user_fname: "",
      user_lname: "",
      user_email: "",
      role_id: "",
      user_pass: "",
      confirm_pass: ""
   });

   const handlePageClick = (event) => {
      window.scroll(0, 0);
      setPage(event.selected + 1);
   };

   const handleDelete = async (id) => {
      try {
         Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
         }).then(async (result) => {
            if (result.isConfirmed) {
               await axios({
                  url: `/backend/delUser`,
                  method: "post",
                  headers: { Authorization: localStorage.getItem('token').split(/["]/g).join(""), },
                  data: {
                     user_id: id
                  }
               }).then((res) => {
                  Swal.fire({
                     position: 'center',
                     icon: 'success',
                     text: 'Your user has been deleted.',
                     showConfirmButton: false,
                     timer: 1000
                  });
               });
               getUsers();
            }
         })
      } catch (err) {
         console.log(err);
      }
   }

   const handleEdit = async (id) => {
      showEdit ? setShowEdit(false) : setShowEdit(true);
      await axios({
         url: `/backend/getUser/${id}`,
         method: "get",
         headers: { Authorization: localStorage.getItem('token').split(/["]/g).join(""), },
      }).then((res) => {
         const Info = res.data.data;
         setUserInfo(current => {
            return {
               ...current,
               user_id: Info.user_id,
               user_fname: Info.user_fname,
               user_lname: Info.user_lname,
               user_email: Info.user_email,
               role_id: Info.role_id,
            }
         })
      });
   }

   const onClickIsVerified = (id, verified) => {
      if (verified === 0) {
         try {
            Swal.fire({
               title: 'Are you sure?',
               text: "You want to confirm this user?",
               icon: 'question',
               showCancelButton: true,
               confirmButtonColor: '#2563eb',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Yes, approve it!'
            }).then(async (result) => {
               if (result.isConfirmed) {
                  await axios({
                     url: `/backend/verified`,
                     method: "post",
                     headers: { Authorization: localStorage.getItem('token').split(/["]/g).join(""), },
                     data: {
                        user_id: id
                     }
                  }).then((res) => {
                     Swal.fire({
                        position: 'center',
                        icon: 'success',
                        text: 'This user has been confirmed',
                        showConfirmButton: false,
                        timer: 1000
                     });
                  });
                  getUsers();
               }
            })
         } catch (err) {
            console.log(err);
         }
      }
      if (verified === 1) {
         Swal.fire({
            title: 'Are you sure?',
            text: "You want to un confirm this user?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, un confirm it!'
         }).then(async (result) => {
            if (result.isConfirmed) {
               await axios({
                  url: `/backend/unVerified`,
                  method: "post",
                  headers: { Authorization: localStorage.getItem('token').split(/["]/g).join(""), },
                  data: {
                     user_id: id
                  }
               }).then((res) => {
                  Swal.fire({
                     position: 'center',
                     icon: 'success',
                     text: 'This user has been confirmed',
                     showConfirmButton: false,
                     timer: 1000
                  });
               });
               getUsers();
            }
         })
      }
   }

   const getUsers = async () => {
      try {
         setLoading(true)
         await axios({
            method: "get",
            url: `/backend/getUsers?page=${page}&per_page=${perPage}`,
            headers: { Authorization: localStorage.getItem('token').split(/["]/g).join(""), },
         }).then((res) => {
            // console.log(res);
            setLoading(false);
            setUsersInfo(res.data.data)
         })
      } catch (err) {
         if (err.response?.status === 401) {
            setLoading(false);
            Swal.fire({
               icon: 'warning',
               text: 'You do not have permission to use',
               confirmButtonColor: "rgb(29 78 216)",
            }).then(() => {
               navigate("/");
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
         const EditUser = async () => {
            await axios({
               method: "post",
               headers: { Authorization: localStorage.getItem('token').split(/["]/g).join("") },
               url: "/backend/editUser",
               data: userInfo
            }).then(() => {
               Swal.fire({
                  icon: 'success',
                  text: 'Successfully',
                  showConfirmButton: false,
                  timer: 1000
               }).then((res) => {
                  // console.log(res);
                  setShowEdit(false);
                  getUsers();
               });
               setIsSuccess(false);
            }).catch((err) => {
               console.log(err);
            });
         }
         EditUser();
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

   useEffect(() => {
      const getUsers = async () => {
         try {
            setLoading(true)
            await axios({
               method: "get",
               url: `/backend/getUsers?page=${page}&per_page=${perPage}`,
               headers: { Authorization: localStorage.getItem('token').split(/["]/g).join(""), },
            }).then((res) => {
               // console.log(res);
               setLoading(false);
               setTotalPage(res.data.total_pages);
               setUsersInfo(res.data.data)
            })
         } catch (err) {
            if (err.response?.status === 401) {
               setLoading(false);
               Swal.fire({
                  icon: 'warning',
                  text: 'You do not have permission to use',
                  confirmButtonColor: "rgb(29 78 216)",
               }).then(() => {
                  navigate("/");
               });
            }
         }
      }
      getUsers();
   }, [navigate, page, perPage])

   const handleChangeEdit = () => {
      setUserInfo(current => {
         return {
            ...current, user_pass: "", confirm_pass: ""
         }
      })
      changePass ? setChangPass(false) : setChangPass(true);
   }

   useEffect(() => {
      if (showEdit) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'unset';
      }
   }, [showEdit])

   useEffect(() => {
      // console.log(userInfo.role_id);
      window.scrollTo(0, 0);
   }, []);


   return (
      <>
         <Layout>
            <div className="md:px-6 flex md:justify-start justify-center text-3xl font-light mb-5">User & Admin</div>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg sm:p-6 pt-0">
               {/* loading */}
               {loading && (
                  <div className="flex mt-5 items-center justify-center text-center">
                     <div role="status">
                        <svg
                           aria-hidden="true"
                           className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                           viewBox="0 0 100 101"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                           />
                           <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                           />
                        </svg>
                        <span className="sr-only">Loading...</span>
                     </div>
                  </div>
               )}
               {usersInfo && (
                  <>
                     <table className="w-full md:table hidden text-left">
                        <thead>
                           <tr className="text-gray-400">
                              <th className="p-5">NO.</th>
                              <th className="p-5">RESEARCH</th>
                              <th className="p-5">USER</th>
                              <th className="p-5">ROLE</th>
                              <th className="p-5">STATUS</th>
                              <th className="p-5">ACTIONS</th>
                           </tr>
                        </thead>
                        <tbody className="md:text-base text-sm">
                           {/* {console.log(userInfo)} */}
                           {usersInfo.map((item, key) => (
                              <tr className="border border-neutral-700" key={key}>
                                 <td>
                                    <div className="flex items-center p-5">
                                       <span className="ml-1 text-blue-500 font-bold">{item.user_id}</span>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center p-5">
                                       <span className="ml-1 break-all">
                                          {item.user_email.length > 50
                                             ? `${item.user_email.substring(0, 50)} ...` : item.user_email
                                          }
                                       </span>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center p-5 whitespace-nowrap">
                                       <span className="ml-1">{item.user_fname + " " + item.user_lname}</span>
                                    </div>
                                 </td>
                                 <td className="p-5 whitespace-nowrap">
                                    <div className={`${item.role_id === 2 ? "text-blue-500 " : "text-amber-500 "}  cursor-pointer rounded-full w-fit px-2`}>
                                       {item.role_id === 1 ? "admin" : "user"}
                                    </div>
                                 </td>
                                 <td className="p-5 whitespace-nowrap">
                                    <div onClick={() => onClickIsVerified(item.user_id, item.isVerified)}
                                       className={`${item.isVerified === 1 ? "text-green-300 bg-green-900" : "text-red-300 bg-red-900"} bg-opacity-50 cursor-pointer rounded-full w-fit px-2`}>
                                       {item.isVerified === 1 ? "Verified" : "Not Verified"}
                                    </div>
                                 </td>
                                 <td className="p-5 whitespace-nowrap">
                                    <div className="flex justify-between md:justify-start">
                                       <div className="ml-1"></div>
                                       {/* edit */}
                                       <button onClick={() => handleEdit(item.user_id)}>
                                          <svg className="w-5 h-5 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                          </svg>
                                       </button>
                                       {/* delete */}
                                       <div className="ml-1"></div>
                                       <button onClick={() => handleDelete(item.user_id)}>
                                          <svg className="w-5 h-5 cursor-pointer text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                          </svg>
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     {/* mobile view */}
                     <div className="grid grid-cols-1 gap-4 md:hidden">
                        {usersInfo.map((item, key) => (
                           <div key={key} className="bg-neutral-900 p-4 rounded-lg shadow">
                              <div className="flex items-center space-x-2 text-sm">
                                 <div>
                                    <a href="" className="text-blue-500 font-bold hover:underline">
                                       {item.user_id}
                                    </a>
                                 </div>
                                 <div className={`${item.role_id === 2 ? "text-blue-500" : "text-amber-500"}  cursor-pointer rounded-full w-fit px-2`}>
                                    {item.role_id === 1 ? "admin" : "user"}
                                 </div>
                                 <div onClick={() => onClickIsVerified(item.user_id, item.isVerified)}
                                    className={`${item.isVerified === 1 ? "text-green-300 bg-green-900" : "text-red-300 bg-red-900"} bg-opacity-50 cursor-pointer rounded-full w-fit px-2`}>
                                    {item.isVerified === 1 ? "Verified" : "Not Verified"}
                                 </div>
                              </div>

                              <div className="flex items-center my-5 whitespace-nowrap">
                                 <span>{item.user_fname + " " + item.user_lname}</span>
                              </div>
                              <div className="flex justify-end md:justify-start">
                                 {/* edit */}
                                 <button onClick={() => handleEdit(item.user_id)}>
                                    <svg className="w-5 h-5 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                 </button>
                                 {/* delete */}
                                 <div className="ml-1"></div>
                                 <button onClick={() => handleDelete(item.user_id)}>
                                    <svg className="w-5 h-5 cursor-pointer text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </>
               )}
            </div>
            {totalPage && (
               <div className={`${loading && "invisible"}`}>
                  <ReactPaginate
                     className="mt-5 flex justify-center items-center list-none mb-20 md:mb-0  gap-1"
                     breakLabel="..."
                     nextLabel="->"
                     onPageChange={handlePageClick}
                     pageRangeDisplayed={3}
                     pageCount={totalPage}
                     previousLabel="<-"
                     renderOnZeroPageCount={null}
                     pageLinkClassName="page-num"
                     previousClassName="page-num"
                     nextLinkClassName="page-num"
                     activeClassName="active"
                  />
               </div>
            )}
         </Layout>
         {/* edit profile */}
         <div className={`${!showEdit && "hidden"}`} >
            <div className="absolute z-50 top-0 left-0 h-full bg-opacity-50 w-full bg-gray-900">
               <div className="flex justify-center items-center h-screen text-gray-600">
                  <div className="bg-white rounded h-full md:h-3/4 w-full md:w-[600px] block">
                     <div className="flex p-2 items-center">
                        {/* close */}
                        <div onClick={() => { setShowEdit(false) }} className="text-2xl w-[62] p-2 rounded-full hover:bg-gray-100 cursor-pointer">
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
                           <button onClick={(e) => { submitEditProfile(e) }} className="bg-blue-600 hover:bg-blue-500 w-[62] text-blue-50 rounded-full text-sm py-2 px-4 shadow-sm">
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
                           <div className="w-5/6 p-2">
                              <span>Role</span>
                              <select
                                 onChange={e => setUserInfo(current => {
                                    return {
                                       ...current, role_id: e.target.value
                                    }
                                 })}
                                 defaultValue={userInfo.role_id} className="py-2 px-4 w-full h-10 rounded-full bottom-2 border focus:outline-none focus:border-blue-600 focus:ring-blue-600 focus:ring-1">
                                 <option value="1">Admin</option>
                                 <option value="2">User</option>
                              </select>
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

export default BackUsers;