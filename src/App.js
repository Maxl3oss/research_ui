import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "css/index.css";
// path
import Home from "views/Home";
import SignIn from 'views/SignIn';
import NoPage from "views/NoPage";
import SignUp from 'views/SignUp';
import Detail from 'views/Detail';
import AddResearch from 'views/AddResearch';
import MyResearch from 'views/MyResearch';
import EditResearch from 'views/EditResearch';
//provider 
import SearchContext from 'context/SearchProvider';
import ResearchContext from 'context/ResearchProvider';
function App() {
  return (
    <BrowserRouter>
      <ResearchContext>
        <SearchContext>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/addResearch" element={<AddResearch />} />
            <Route path="/editResearch" element={<EditResearch />} />
            <Route path="/myResearch" element={<MyResearch />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </SearchContext>
      </ResearchContext>
    </BrowserRouter>
  );
}
export default App;
