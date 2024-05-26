import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isLoggedIn = user !== null;

  const resetUser = () => {
    setUser(null);
    localStorage.removeItem('userData');
  };

  const setUserContext = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  return (
    <UserContext.Provider value={{ user, setUserContext, resetUser, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
