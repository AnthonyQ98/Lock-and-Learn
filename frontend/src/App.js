import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');


  const handleEncrypt = async () => {
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
      setResult(data.encryptedText);
    } catch (error) {
      console.error('Error during encryption:', error);
    }
  };

  const handleDecrypt = async () => {
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
      setResult(data.decryptedText);
    } catch (error) {
      console.error('Error during decryption:', error);
    }
  };

  return (
    <div className="App">
      <h1>Encrypt/Decrypt Text</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      <button onClick={handleDecrypt}>Decrypt</button>
      <div>
        <h2>Result:</h2>
        <p>{result}</p>
      </div>
    </div>
  );
}

export default App;
