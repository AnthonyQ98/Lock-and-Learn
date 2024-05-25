import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './UserPage.css';

const UserPage = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem('userData');
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedData = queryParams.get('data');
    
    if (encodedData) {
      try {
        const decodedData = decodeURIComponent(encodedData);
        const parsedData = JSON.parse(decodedData);
        setUserData(parsedData);
        localStorage.setItem('userData', JSON.stringify(parsedData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [location.search]);

  return (
    <div className="container">
      <h2 className="title">User Page</h2>
      {userData && (
        <div className="userInfo">
          <p>ID: {userData.id}</p>
          <p>Email: {userData.email}</p>
          <p>Name: {userData.name}</p>
        </div>
      )}
    </div>
  );
};

export default UserPage;
