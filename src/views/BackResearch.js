import React, { useEffect, useMemo, useState } from 'react';
import Layout from 'layouts/BackendLayout';
import axios from 'services/axios';
import { useNavigate } from 'react-router-dom';

const BackResearch = () => {
   const [researchInfo, setResearchInfo] = useState();
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      const getResearch = async () => {
         await axios({
            method: "get",
            url: "/backend/getResearch",
            headers: { Authorization: localStorage.getItem('token').split(/["]/g).join(""), },
         }).then((res) => {
            setResearchInfo(res.data.data)
         })
      }
      getResearch();
   }, [])

   const onClickDetail = (id) => {
      navigate("/backend/detail", {
         state: {
            id: id,
         },
      });
   };

   useEffect(() => {
      console.log(researchInfo);
   }, [researchInfo]);

   return (
      <Layout>
         <div class="overflow-x-auto relative shadow-md sm:rounded-lg p-6">
            <div className="flex md:justify-start justify-center text-3xl font-light mb-5">BackResearch</div>
            {researchInfo && (
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-gray-400">
                        <th className="p-5">NO.</th>
                        <th className="p-5">RESEARCH</th>
                        <th className="p-5">USER</th>
                        <th className="p-5">STATUS</th>
                        <th className="p-5">ACTIONS</th>
                     </tr>
                  </thead>
                  <tbody>
                     {researchInfo.map((item, key) => (
                        <tr>
                           <td>
                              <div className="flex items-center p-5">
                                 <span className="ml-1">{item.id}</span>
                              </div>
                           </td>
                           <td>
                              <div className="flex items-center p-5">
                                 <span className="ml-1">{item.title}</span>
                              </div>
                           </td>
                           <td>
                              <div className="flex items-center p-5">
                                 <span className="ml-1">{item.user_fname + " " + item.user_lname}</span>
                              </div>
                           </td>
                           <td className="p-5">
                              <div className={`${item.isVerified === 1 ? "text-green-900 bg-green-400" : "text-red-50 bg-red-600"} rounded-full w-fit px-2`}>
                                 {item.isVerified === 1 ? "Verified" : "Not Verified"}
                              </div>
                           </td>
                           <td className="p-5 inline-block">
                              <div className="flex justify-between items-center">
                                 {/* detail */}
                                 <button onClick={() => onClickDetail(item.id)}>
                                    <svg className="w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                 </button>
                                 <div className="ml-1"></div>
                                 {/* edit */}
                                 <svg className="w-5 h-5 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                 </svg>
                                 {/* delete */}
                                 <div className="ml-1"></div>
                                 <svg class="w-5 h-5 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                 </svg>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
      </Layout>
   )
}

export default BackResearch