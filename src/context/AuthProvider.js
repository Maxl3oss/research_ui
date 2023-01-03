import React, { useEffect, useMemo, useState } from 'react';
import axios from 'services/axios';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
   const [Profile, setProfile] = useState({
      user_id: null,
      user_fname: null,
      user_lname: null,
      user_email: null,
      user_role: null
   });

   useEffect(() => {
      if (localStorage.getItem("token")) {
         axios({
            method: "get",
            url: "/users/profile",
            headers: { Authorization: localStorage.getItem('token').split(/["]/g).join("") },
         }).then((res) => {
            // console.log(res);
            let user = res.data.data;
            setProfile({
               user_id: user.user_id,
               user_fname: user.user_fname,
               user_lname: user.user_lname,
               user_email: user.user_email,
               user_role: user.role_id
            });
         })
      }
   }, [])

   const update = () => {
      axios({
         method: "get",
         url: "/users/profile",
         headers: { Authorization: localStorage.getItem('token').split(/["]/g).join("") },
      }).then((res) => {
         // console.log(res);
         let user = res.data.data;
         setProfile({
            user_id: user.user_id,
            user_fname: user.user_fname,
            user_lname: user.user_lname,
            user_email: user.user_email,
            user_role: user.role_id
         });
      })
   }

   const value = useMemo(() => ({ Profile, setProfile, update }), [Profile]);

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   )
}
export { AuthContext };
export default AuthProvider;