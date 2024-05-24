import React, { useState, useEffect } from 'react';

const UserPage = () => {
  const [aesKey, setAesKey] = useState('');

  useEffect(() => {
    const fetchAesKey = async () => {
      try {
        const response = await fetch('http://localhost:8080/user/aeskey');
        const data = await response.json();
        setAesKey(data.aesKey);
      } catch (error) {
        console.error('Error fetching AES key:', error);
      }
    };

    fetchAesKey();
  }, []);

  return (
    <div>
      <h1>Your AES Key</h1>
      {aesKey ? <p>{aesKey}</p> : <p>Loading...</p>}
    </div>
  );
};

export default UserPage;
