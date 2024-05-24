import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Pages/Home';
import EncryptForm from './components/Pages/EncryptPage';
import DecryptForm from './components/Pages/DecryptPage';
import UserPage from './components/Pages/UserPage';
import './App.css';

function App() {
  const [encryptResult, setEncryptResult] = useState('');
  const [decryptResult, setDecryptResult] = useState('');

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

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/encrypt" element={<EncryptForm onEncrypt={handleEncrypt} />} />
          <Route path="/decrypt" element={<DecryptForm onDecrypt={handleDecrypt} />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
