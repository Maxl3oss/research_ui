import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "css/App.css";
// path
import Home from "views/Home";
import SignIn from 'views/SignIn';
import NoPage from "views/NoPage";
import SignUp from 'views/SignUp';
import Detail from 'views/Detail';
import AddResearch from 'views/AddResearch';
//provider 
import SearchContext from 'context/SearchProvider';

function App() {
  return (
    <BrowserRouter>
      <SearchContext>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/addResearch" element={<AddResearch />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </SearchContext>
    </BrowserRouter>
  );
}
export default App;
