import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "css/App.css";
// path
import Home from "views/Home";
import SignIn from 'views/SignIn';
import NoPage from "views/NoPage";
import SignUp from 'views/SignUp';

function App() {
  // const [token, setToken] = useState();

  // if (!token) {
  //   return <SignIn setToken={setToken} />
  // }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signIn" element={<SignIn />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
