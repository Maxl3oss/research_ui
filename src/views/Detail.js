import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Layout from "layouts/FrontendLayout";
import { useNavigate } from "react-router-dom";
import axios from "services/axios";
import moment from "moment";
import Swal from "sweetalert2";
// image
import noImage from "images/NoImage.gif";

const Detail = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const [id, setId] = useState();
   const [items, setItems] = useState([]);

   useEffect(() => {
      try {
         setId(location.state.id);
      } catch (err) {
         console.log(err);
         navigate("/");
      }
   }, [navigate, location.state.id]);

   useEffect(() => {
      if (id) {
         const getResearch = async () => {
            try {
               const res = await axios({
                  method: "get",
                  url: `/research/get/${id}`,
               });
               // console.log(res.data.data);
               setItems(res.data.data)
            } catch (err) {
               console.log(err);
            }
         }
         getResearch();
      }
   }, [id]);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [])

   const onClickFileDownload = async (fileID, fileName) => {
      // console.log("Click ", fileID);
      try {
         await axios({
            method: "get",
            headers: { Authorization: localStorage.getItem('token').split(/["]/g).join("") },
            url: `research/file/${fileID}/download`,
            responseType: "blob"
         }).then((res) => {
            // console.log(res.data);
            // download file pdf
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${fileName}`;
            link.click();
         });
         // console.log(res.data.data);
      } catch (err) {
         if (err.response?.status === 403) {
            Swal.fire({
               icon: 'warning',
               text: 'Token time out!',
               confirmButtonColor: "rgb(29 78 216)",
            }).then(() => {
               localStorage.removeItem("user");
               localStorage.removeItem("token");
               navigate("/signIn");
            });
         } else if (err.response?.status === 401) {
            Swal.fire({
               icon: 'warning',
               text: 'Token not found!',
               confirmButtonColor: "rgb(29 78 216)",
            }).then(() => {
               localStorage.removeItem("user");
               localStorage.removeItem("token");
               navigate("/signIn");
            });
         } else if (!localStorage.getItem('token')) {
            Swal.fire({
               icon: 'warning',
               text: 'Please sign in!',
               confirmButtonColor: "rgb(29 78 216)",
            }).then(() => {
               localStorage.removeItem("user");
               localStorage.removeItem("token");
               navigate("/signIn");
            });
         }
      }
   }

   return (
      <Layout>
         <div className="min-h-screen md:pt-5 md:px-5 bg-slate-200  flex justify-center items-start">
            <div className="mt-1 mb-14 md:mb-10 p-3 md:p-8 w-full bg-white shadow-md  rounded-xl">
               {items.map((item, key) => (
                  <div key={key}>

                     <div className="flex justify-center items-center">
                        <img alt="" className="h-40" src={item.image ? item.image : noImage} />
                     </div>
                     <hr className="mb-3" />

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           title
                        </div>
                        <div className="flex-initial md:w-4/5 block break-words text-sm text-slate-800">
                           {item.title}
                        </div>
                     </div>

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           Title Alternative
                        </div>
                        <div className="flex-initial md:w-4/5 block break-words text-sm text-slate-800">
                           {item.title_alternative}
                        </div>
                     </div>

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           Creator
                        </div>
                        <div className="block break-words text-sm text-slate-800">
                           {item.creator}
                        </div>
                     </div>

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           Subject
                        </div>
                        <div className="block break-words text-sm text-slate-800">
                           {item.subject}
                        </div>
                     </div>

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12">
                           Description
                        </div>
                        <div className="flex-initial md:w-4/5 block break-words text-sm text-slate-800">
                           {item.description}
                        </div>
                     </div>

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           Publisher
                        </div>
                        <div className="block break-words text-sm text-slate-800">
                           {item.publisher}
                        </div>
                     </div>

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           Contributor
                        </div>
                        <div className="block break-words text-sm text-slate-800">
                           {item.contributor}
                        </div>
                     </div>

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           Date
                        </div>
                        <div className="block break-words text-sm text-slate-800">
                           {moment(item.date).add(543, 'year').format('LLLL')}
                        </div>
                     </div>

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           Source
                        </div>
                        <div className="block break-words text-sm text-slate-800">
                           {item.source}
                        </div>
                     </div>

                     <div className="flex flex-col mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           Rights
                        </div>
                        <div className="block break-words text-sm text-slate-800">
                           {item.rights}
                        </div>
                     </div>

                     {/* file pdf download*/}
                     <div className="flex flex-col mt-1 mb-1 md:flex-row items-start">
                        <div className="text-lg md:w-2/12 ">
                           Document
                        </div>
                        <button
                           onClick={() => item.file_name && onClickFileDownload(item.file_id, item.file_name)}
                           className={(item.file_name ? "text-green-700 bg-green-50 rounded-full " : "text-red-700 bg-red-100 rounded-full ") + "flex px-2 py-1 cursor-pointer break-words text-sm text-slate-800"}>
                           {item.file_name ? item.file_name : "No File!"}
                           <div className="ml-3">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                           </div>
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </Layout >)
};

export default Detail;
