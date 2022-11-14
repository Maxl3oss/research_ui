import React from 'react';
import Nav from 'components/frontend/Nav';
import Foot from 'components/frontend/Foot';

const Frontend = ({ children }) => {
   return (
      <div className='flex flex-col h-screen justify-between'>
         <Nav />
         <main>{children}</main>
         <Foot />
      </div>
   )
}
export default Frontend;