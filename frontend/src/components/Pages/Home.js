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
    console.log('useEffect triggered');

    const checkUserAndFetchStatus = async () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        console.log('Parsed user data:', parsedUserData);

        setUserContext(parsedUserData);

        const status = await fetchQuizStatus(user);
        console.log('Fetched quiz status:', status);
        setQuizCompleted(status.quizCompleted);
        setEndQuizCompleted(status.endQuizCompleted);
      }
    };

    checkUserAndFetchStatus();
  }, [isLoggedIn]);

  const handleSignIn = () => {
    window.location.href = 'http://localhost:8080/google_login';
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const fetchQuizStatus = async (user) => {
    try {
      console.log("oauthid: ", user.id)
      const response = await fetch(`http://localhost:8080/quiz-status?oauthid=${user.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const status = await response.json();
      console.log("status", status)
      return status;
    } catch (error) {
      console.error('Error fetching quiz status:', error);
      return { quizCompleted: false, endQuizCompleted: false };
    }
  };

  const handleBeginLearning = () => {
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
              {endQuizCompleted ? (
                <>
                  <button onClick={() => navigateTo('/encrypt')}>Encrypt</button>
                  <button onClick={() => navigateTo('/decrypt')}>Decrypt</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigateTo('/learning-platform')}>Continue Learning</button>
                  <button onClick={() => navigateTo('/end-quiz')}>Complete End Quiz</button>
                </>

              )}
              <button onClick={() => navigateTo('/profile')}>View Profile</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
