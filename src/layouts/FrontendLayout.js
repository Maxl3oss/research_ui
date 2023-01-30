import React from 'react';
import Nav from 'components/frontend/Nav';
import Foot from 'components/frontend/Foot';
import Menubar from 'components/frontend/Menubar';
import Sidebar from 'components/frontend/Sidebar';

const Frontend = ({ children }) => {
   return (
      <div className="flex flex-col h-screen">
         <Nav />
         <div className="flex">
            <Sidebar />
            <main className="flex-grow mt-16 w-4/5">{children}</main>
         </div>
         <Menubar />
         <Foot />
      </div>
   )
}
export default Frontend;