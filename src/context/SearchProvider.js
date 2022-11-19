import React, { useState, useMemo } from "react";

const SearchContext = React.createContext();

const SearchProvider = ({ children }) => {
   const [search, setSearch] = useState("");
   const [type, setType] = useState("all");

   const updateSearch = (str) => {
      setSearch(str);
   }

   const updateType = (type) => {
      setType(type);
   }

   const value = useMemo(() => ({ search, updateSearch, type, updateType }), [search, type]);

   return (
      <SearchContext.Provider value={value} >
         {children}
      </SearchContext.Provider>
   )
}

export { SearchContext };
export default SearchProvider;