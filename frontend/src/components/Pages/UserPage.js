import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const UserPage = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedData = queryParams.get('data');
    
    if (encodedData) {
      try {
        const decodedData = decodeURIComponent(encodedData);
        const parsedData = JSON.parse(decodedData);
        setUserData(parsedData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [location.search]);

  return (
    <div>
      <h2>User Page</h2>
      {userData && (
        <div>
          <p>ID: {userData.id}</p>
          <p>Email: {userData.email}</p>
          <p>Name: {userData.name}</p>
          {/* Render other user data as needed */}
        </div>
      )}
    </div>
  );
};

export default UserPage;
