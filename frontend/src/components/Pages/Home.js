import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext/UserContext'; // Adjust the import path if needed
import SignInButton from '../Button/SignInButton';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setUserContext } = useUser();

  useEffect(() => {
    // Check if the user is logged in by checking local storage
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUserContext(JSON.parse(userData));
    }
  }, [setUserContext]);

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
