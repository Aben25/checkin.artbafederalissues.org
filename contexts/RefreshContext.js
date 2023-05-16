// contexts/RefreshContext.js
import React from 'react';
import algoliasearch from "algoliasearch";
import { useState } from "react";


export const RefreshContext = React.createContext();

export const RefreshProvider = ({children}) => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [font, setFontFace] = useState(25);

  
  const searchClient = algoliasearch(
    "SWSFY6ZO07",
    "286c1017af1002e899ded37866d02198"
  );

  const triggerParentUpdate = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <RefreshContext.Provider value={{ refreshKey, triggerParentUpdate, searchClient,font, setFontFace }}>
      {children}
    </RefreshContext.Provider>
  );
};
