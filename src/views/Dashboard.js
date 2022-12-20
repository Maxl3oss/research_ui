import React from 'react';
import Layout from 'layouts/BackendLayout';


const Dashboard = () => {
   return (
      <Layout>
         <div className="h-screen bg-dark mx-auto p-6">
            <div className="text-3xl font-light mb-5">Dashboard</div>
            <div className="flex flex-col lg:flex-row justify-center md:justify-around lg:mt-0 mt-5">
               <div className="bg-card w-full lg:w-[352px] h-[158px] p-6 flex flex-col rounded">
                  <div className="flex justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-14 h-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                     </svg>
                  </div>
                  <div className="text-xl font-light text-slate-400">Clients</div>
                  <div className="w-60 sm:w-96 text-2xl">20</div>
               </div>
               <div className="bg-card w-full lg:w-[352px] h-[158px] my-5 lg:my-0 lg:mx-5 p-6 flex flex-col rounded">
                  <div className="flex justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-14 h-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                     </svg>
                  </div>
                  <div className="text-xl font-light text-slate-400">Research</div>
                  <div className="text-2xl">40</div>
               </div>
               <div className="bg-card w-full lg:w-[352px] h-[158px] p-6 flex flex-col rounded">
                  <div className="flex justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-14 h-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                  </div>
                  <div className="text-xl font-light text-slate-400">Admin</div>
                  <div className="w-60 sm:w-96 text-2xl">2</div>
               </div>
            </div>
         </div>
      </Layout>
   )
}

export default Dashboard