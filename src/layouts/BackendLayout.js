import React from 'react';
import Sidebar from 'components/backend/Sidebar';
import Nav from 'components/backend/Nav';
import "css/backend.css";

const BackendLayout = ({ children }) => {
   return (
      <div className="flex flex-row min-h-screen bg-dark">
         <Sidebar />
         <div className="flex flex-col md:px-0 px-5 w-full">
            <Nav />
            {children}
         </div>
      </div>
   )
}

export default BackendLayout