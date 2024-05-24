import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignInButton from '../Button/SignInButton';

const Home = () => {
  const navigate = useNavigate(); // Use useNavigate hook to get the navigate function

  const handleSignIn = () => {
    window.location.href = 'http://localhost:8080/google_login';
};

  const navigateTo = (path) => {
    navigate(path); // Call the navigate function to navigate to the specified path
  };

  return (
    <div>
      <h1>Welcome to Lock and Learn</h1>
      <p>Please sign in to continue:</p>
      <SignInButton onSignIn={handleSignIn} />
      <button onClick={() => navigateTo('/encrypt')}>Encrypt & Learn</button>
      <button onClick={() => navigateTo('/decrypt')}>Decrypt & Learn</button>
      <button onClick={() => navigateTo('/user')}>User Page</button>
    </div>
  );
};

export default Home;
