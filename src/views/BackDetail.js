import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "services/axios";
import axios2 from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import Layout from "layouts/BackendLayout";
// image
import noImage from "images/NoImage.gif";

const BackDetail = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const [id, setId] = useState();
   const [items, setItems] = useState([]);

   useEffect(() => {
      try {
         setId(location.state.id);
      } catch (err) {
         console.log(err);
         navigate("/backend/research");
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

   const onClickFileDownload = async (URL, fileName) => {
      // console.log("Click ", fileID);
      try {
         await axios2({
            method: "get",
            url: `${URL}`,
            responseType: "blob"
         }).then((res) => {
            // download file pdf
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${fileName}`;
            link.click();
         });
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
         }
      }
   }

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <Layout>
         <div className="min-h-screen md:pt-5 md:pr-5 flex justify-center items-start">
            <div className="mt-1 mb-14 md:mb-10 p-3 md:p-8 w-full drop-shadow-xl rounded-xl bg-neutral-900">
               {items.map((item, key) => (
                  <div key={key} className="flex text-slate-50">

                     <div className="mr-5 w-fit object-scale-down lg:flex hidden">
                        <img alt="" className="border " src={item.image ? item.image : noImage} />
                     </div>

                     <div className="lg:w-4/6 w-full">

                        <div className="lg:hidden lg:mb-0 mb-5 flex justify-center items-center">
                           <img alt="" className="border " src={item.image ? item.image : noImage} />
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              title
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {item.title}
                           </div>
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Title Alternative
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {item.title_alternative}
                           </div>
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Creator
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {item.creator}
                           </div>
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Subject
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {item.subject}
                           </div>
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Description
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {item.description}
                           </div>
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Publisher
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {item.publisher}
                           </div>
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Contributor
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {item.contributor}
                           </div>
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Date
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {moment(item.date).add(543, 'year').format('LLLL')}
                           </div>
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Source
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {item.source}
                           </div>
                        </div>

                        <div className="flex flex-col mb-1 items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Rights
                           </div>
                           <div className="block break-all text-sm text-slate-200">
                              {item.rights}
                           </div>
                        </div>

                        {/* file pdf download*/}
                        <div className="flex flex-col mt-1 mb-1 lg:flex-row items-start">
                           <div className="text-lg lg:w-2/12 min-w-fit font-bold">
                              Document
                           </div>
                           <button
                              onClick={() => item.file_pdf && onClickFileDownload(item.file_pdf, item.file_pdf.split("/").slice(-1)[0])}
                              className={(item.file_pdf ? "text-green-300 bg-green-900 rounded-full " : "text-red-300 bg-red-900 rounded-full ") + "bg-opacity-50 flex px-2 py-1 cursor-pointer break-all text-sm "}>
                              {item.file_pdf ? item.file_pdf.split("/").slice(-1)[0] : "No File!"}
                              <div className="ml-3">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                 </svg>
                              </div>
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </Layout>
   )
};

export default BackDetail;
