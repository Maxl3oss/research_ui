import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "css/App.css";
// path
import Home from "views/Home";
import SignIn from 'views/SignIn';
import NoPage from "views/NoPage";
import SignUp from 'views/SignUp';

const SearchContext = React.createContext();

function App() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const updateSearch = (str) => {
    console.log("App -> " + str);
    setSearch(str);
  }
  const updateType = (type) => {
    console.log("App -> " + type);
    setType(type);
  }

  return (
    <SearchContext.Provider value={{
      search: search,
      updateSearch: updateSearch,
      type: type,
      updateType: updateType
    }} >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signIn" element={<SignIn />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </SearchContext.Provider >
  );
}
export { SearchContext };
export default App;
