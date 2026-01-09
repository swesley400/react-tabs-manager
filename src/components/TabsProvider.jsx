import React from 'react';

export const TabsContext = React.createContext(null);

export const TabsProvider = ({ children, cacheLimit }) => {
  return (
    <TabsContext.Provider value={{ cacheLimit }}>
      {children}
    </TabsContext.Provider>
  );
};
