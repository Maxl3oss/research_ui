import React, { useEffect, useState } from 'react';
import Layout from 'layouts/BackendLayout';
import axios from 'services/axios';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Dashboard = () => {
   const navigate = useNavigate();
   const [items, setItems] = useState();
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const getResearch = async () => {
         try {
            setLoading(true);
            const res = await axios({
               url: `/backend/dashboard`,
               method: "get",
               headers: { Authorization: localStorage.getItem('token').split(/["]/g).join(""), },
            })
            setLoading(false);
            setItems(res.data.data[0]);
         } catch (err) {
            setLoading(false);
            // console.error(err);
            if (err.response?.status === 401) {
               Swal.fire({
                  icon: 'warning',
                  text: 'You do not have permission to use',
                  confirmButtonColor: "rgb(29 78 216)",
               }).then(() => {
                  navigate("/");
               });
            } else if (err.response?.status === 403) {
               Swal.fire({
                  icon: 'warning',
                  text: 'Token time out!',
                  confirmButtonColor: "rgb(29 78 216)",
               }).then(() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/signIn");
               });
            }
         }
      };
      getResearch();
   }, [navigate]);

   useEffect(() => {
      // console.log(items);
      window.scrollTo(0, 0);
   }, [items]);

   return (
      <Layout>
         <div className="min:h-screen bg-dark mx-auto pt-0 p-6 mb-20">
            <div className="text-3xl font-light mb-5">Dashboard</div>
            {/* loading */}
            {loading && (
               <div className="flex mt-5 items-center justify-center text-center ">
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
            <>
               <div className="flex flex-col lg:flex-row justify-center md:justify-around lg:mt-0 mt-5 mb-5">
                  <div className="bg-card w-full lg:w-[352px] h-[158px] p-6 flex flex-col rounded">
                     <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                     </div>
                     <div className="text-lg font-light text-slate-400">Clients</div>
                     <div className="w-60 sm:w-96 text-2xl">{items?.users ? items.users : 0}</div>
                  </div>
                  <div className="bg-card w-full lg:w-[352px] h-[158px] my-5 lg:my-0 lg:mx-5 p-6 flex flex-col rounded">
                     <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                     </div>
                     <div className="text-lg font-light text-slate-400">Admin</div>
                     <div className="w-60 sm:w-96 text-2xl">{items?.admin ? items.admin : 0}</div>
                  </div>
                  <div className="bg-card w-full lg:w-[352px] h-[158px] p-6 flex flex-col rounded">
                     <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                     </div>
                     <div className="text-lg font-light text-slate-400">Unverified Clients</div>
                     <div className="w-60 sm:w-96 text-2xl">{items?.user_notVerified ? items.user_notVerified : 0}</div>
                  </div>
               </div>

               <div className="flex flex-col lg:flex-row justify-center md:justify-around lg:mt-0 mt-5">
                  <div className="bg-card w-full lg:w-[352px] h-[158px] p-6 flex flex-col rounded">
                     <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                        </svg>
                     </div>
                     <div className="text-lg font-light text-slate-400">All Research</div>
                     <div className="w-60 sm:w-96 text-2xl">{items?.rs_Verified ? items.rs_Verified + items.rs_Unverified : 0}</div>
                  </div>
                  <div className="bg-card w-full lg:w-[352px] h-[158px] my-5 lg:my-0 lg:mx-5 p-6 flex flex-col rounded">
                     <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
                        </svg>
                     </div>
                     <div className="text-lg font-light text-slate-400">Verified Research</div>
                     <div className="text-2xl">{items?.rs_Verified ? items.rs_Verified : 0}</div>
                  </div>
                  <div className="bg-card w-full lg:w-[352px] h-[158px] p-6 flex flex-col rounded">
                     <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                     </div>
                     <div className="text-lg font-light text-slate-400">Unverified research</div>
                     <div className="text-2xl">{items?.rs_Unverified ? items.rs_Unverified : 0}</div>
                  </div>
               </div>
            </>
         </div>
      </Layout>
   )
}

export default Dashboard