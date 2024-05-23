import React, { useState } from 'react';
import EncryptForm from './components/EncryptForm/EncryptForm';
import DecryptForm from './components/DecryptForm/DecryptForm';
import './App.css';

function App() {
  const [text, setText] = useState('');
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
    <div className="app">
      <h1>Encrypt and Decrypt Text</h1>
      <EncryptForm onEncrypt={handleEncrypt} />
      <DecryptForm onDecrypt={handleDecrypt} />
      <div className="result">
        <h2>Encryption Result:</h2>
        <p>{encryptResult}</p>
        <h2>Decryption Result:</h2>
        <p>{decryptResult}</p>
      </div>
    </div>
  );
}

export default App;
