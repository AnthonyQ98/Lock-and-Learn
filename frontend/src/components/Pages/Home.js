import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext/UserContext'; // Adjust the import path if needed
import SignInButton from '../Button/SignInButton';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setUserContext, user } = useUser();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [endQuizCompleted, setEndQuizCompleted] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking local storage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUserContext(parsedUserData);

      // Fetch quiz status from the server or DB
      //fetchQuizStatus(parsedUserData.oauthid).then(status => {
      //  setQuizCompleted(status.quizCompleted);
      //  setEndQuizCompleted(status.endQuizCompleted);
      //});
    }
  }, [setUserContext]);

  const handleSignIn = () => {
    window.location.href = 'http://localhost:8080/google_login';
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const fetchQuizStatus = async (oauthid) => {
    // TO BE COMPLETED
    //const response = await fetch(`/quiz-status?oauthid=${oauthid}`); // need to implement
    //const status = await response.json();
    //return status;
  };

  const handleBeginLearning = () => {
    // Redirect to the starting quiz page
    navigateTo('/start-quiz');
  };

  return (
    <div className="container">
      <h1 className="title">Welcome to Lock & Learn</h1>
      {!isLoggedIn ? (
        <>
          <p className="message">Please sign in to continue:</p>
          <SignInButton onSignIn={handleSignIn} />
        </>
      ) : (
        <div className="buttonContainer">
          {!quizCompleted ? (
            <button onClick={handleBeginLearning}>Begin Learning</button>
          ) : (
            <>
              <button onClick={() => navigateTo('/learning-platform')}>Continue Learning</button>
              {endQuizCompleted ? (
                <>
                  <button onClick={() => navigateTo('/encrypt')}>Encrypt & Learn</button>
                  <button onClick={() => navigateTo('/decrypt')}>Decrypt & Learn</button>
                </>
              ) : (
                <button onClick={() => navigateTo('/end-quiz')}>Complete End Quiz</button>
              )}
              <button onClick={() => navigateTo('/user')}>User Page</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
