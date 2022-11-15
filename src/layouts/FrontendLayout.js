import React from 'react';
import Nav from 'components/frontend/Nav';
import Foot from 'components/frontend/Foot';
import Menubar from 'components/frontend/Menubar';

const Frontend = ({ children }) => {
   return (
      <div className="flex flex-col h-screen">
         <Nav />
         <main className="flex-grow">{children}</main>
         <Menubar />
         <Foot />
      </div>
   )
}
export default Frontend;