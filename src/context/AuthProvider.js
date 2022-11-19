import React, { useState } from 'react';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
   const [fname, setFname] = useState("");

   return (
      <AuthContext.Provider>
         {children}
      </AuthContext.Provider>
   )
}

export default AuthProvider