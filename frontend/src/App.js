import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Pages/Home';
import EncryptForm from './components/Pages/EncryptPage';
import DecryptForm from './components/Pages/DecryptPage';
import UserPage from './components/Pages/UserPage';
import { UserProvider } from './components/UserContext/UserContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import LoginCallback from './components/LoginCallback';
import LearningPlatform from './components/Pages/LearningPlatform';
import StartQuiz from './components/Pages/StartQuizPage';
import EndQuiz from './components/Pages/EndQuizPage';

function App() {
  const [encryptResult, setEncryptResult] = useState('');
  const [decryptResult, setDecryptResult] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = () => {
    window.location.href = 'http://localhost:8080/google_login';
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleEncrypt = async (text) => {
    try {
      const response = await fetch('http://localhost:8080/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEncryptResult(data.encryptedText);
    } catch (error) {
      console.error('Error during encryption:', error);
    }
  };

  const handleDecrypt = async (text) => {
    try {
      const response = await fetch('http://localhost:8080/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDecryptResult(data.decryptedText);
    } catch (error) {
      console.error('Error during decryption:', error);
    }
  };

  // Check if the user is already logged in on component mount
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <UserProvider>
      <Router>
        <Header isLoggedIn={isLoggedIn} onSignIn={handleSignIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/encrypt" element={<EncryptForm onEncrypt={handleEncrypt} />} />
          <Route path="/decrypt" element={<DecryptForm onDecrypt={handleDecrypt} />} />
          <Route path="/learning-platform" element={<LearningPlatform />} />
          <Route path="/start-quiz" element={<StartQuiz />} />
          <Route path="/end-quiz" element={<EndQuiz />} />
          <Route path="/profile" element={<UserPage />} />
          <Route path="/login/callback" element={<LoginCallback />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
