import React, { useState, useMemo } from "react";

const ResearchContext = React.createContext();

const ResearchProvider = ({ children }) => {
   const [researchId, setResearchId] = useState();

   const value = useMemo(() => ({ researchId, setResearchId }), [researchId]);

   return (
      <ResearchContext.Provider value={value}>
         {children}
      </ResearchContext.Provider>
   )
}

export { ResearchContext };
export default ResearchProvider;
