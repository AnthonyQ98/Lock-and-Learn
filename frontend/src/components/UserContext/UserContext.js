import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isLoggedIn = user !== null;

  const resetUser = () => setUser(null);
  const setUserContext = (userData) => setUser(userData);

  return (
    <UserContext.Provider value={{ user, setUser, resetUser, setUserContext, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
