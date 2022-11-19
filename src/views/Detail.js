import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Layout from "layouts/FrontendLayout";
import { useNavigate } from "react-router-dom";
import axios from "services/axios";
import moment from "moment";

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
               console.log(res.data.data);
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

   return (
      <Layout>
         <div className="h-screen bg-slate-200  flex justify-center items-start">
            <div className="mt-1 md:mt-5 md:w-8/12 w-full bg-white  rounded-xl p-4">
               {items.map((item, key) => (
                  <div key={key}>

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
                  </div>
               ))}
            </div>
         </div>
      </Layout>)
};

export default Detail;
