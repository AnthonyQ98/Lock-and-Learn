import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Welcome to Lock and Learn</h1>
      <button onClick={() => navigateTo('/encrypt')}>Encrypt & Learn</button>
      <button onClick={() => navigateTo('/decrypt')}>Decrypt & Learn</button>
      <button onClick={() => navigateTo('/user')}>User Page</button>
    </div>
  );
};

export default Home;
