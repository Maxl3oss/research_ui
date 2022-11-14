import React, { useEffect, useState } from 'react';
import axios from 'services/AuthService';
import Layout from 'layouts/FrontendLayout';
export default function Home() {
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState([]);

   const getAllResearch = async () => {
      setLoading(true);
      try {
         const { data: res } = await axios({
            url: "/research/get",
            method: "get",
         });
         setData(res.res);
         // console.log(Response.Response);
      } catch (err) {
         console.error(err);
      }
      setLoading(false);
   }

   useEffect(() => {
      getAllResearch();
   }, []);

   return (
      <Layout>
         {loading && <div>Loading</div>}
         {!loading && (
            <div className="flex-col flex items-center justify-center">
               {data.map((item, key) => (
                  <div key={key} className="rounded-xl w-full border p-5 shadow-lg m-4 md:w-9/12 bg-white">
                     <div className="flex  items-center justify-between border-b pb-3">
                        <div className="flex items-center space-x-3">
                           <div className="h-8 w-8 rounded-full bg-slate-400 "></div>
                           <div className="text-lg font-bold text-slate-700">{item.creator}</div>
                        </div>
                        <div className="flex items-center space-x-8">
                           <div className="text-xs text-neutral-500">2 hours ago</div>
                        </div>
                     </div>
                     <div className="mt-4 mb-6">
                        <div className="break-words first-letter:mb-3 font-bold">{item.title.length > 150 ? `${item.title.substring(0, 150)} . . .` : item.title}</div>
                        <div className="break-words text-sm text-neutral-600">{item.description.length > 250 ? `${item.description.substring(0, 250)} . . .` : item.description}</div>
                     </div>
                     <div>
                        <div className="flex items-center justify-between text-slate-500">
                           <div className="flex space-x-4 md:space-x-8">
                              <div className='text-sm'>รายละเอียด </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )
         }
      </Layout >
   )
}
