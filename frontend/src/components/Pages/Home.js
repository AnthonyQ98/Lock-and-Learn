import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInButton from '../Button/SignInButton';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking local storage
    const userData = localStorage.getItem('userData');
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignIn = () => {
    window.location.href = 'http://localhost:8080/google_login';
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="container">
      <h1 className="title">Welcome to Lock and Learn</h1>
      {!isLoggedIn ? (
        <>
          <p className="message">Please sign in to continue:</p>
          <SignInButton onSignIn={handleSignIn} />
        </>
      ) : (
        <div className="buttonContainer">
          <button onClick={() => navigateTo('/encrypt')}>Encrypt & Learn</button>
          <button onClick={() => navigateTo('/decrypt')}>Decrypt & Learn</button>
          <button onClick={() => navigateTo('/user')}>User Page</button>
        </div>
      )}
    </div>
  );
};

export default Home;
