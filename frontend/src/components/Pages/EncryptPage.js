import React, { useState } from 'react';
import './EncryptPage.css';
import { useUser } from '../UserContext/UserContext';

const EncryptPage = ({ onEncrypt }) => {
  const [text, setText] = useState('');
  const [encryptedTextBase64, setEncryptedTextBase64] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [inputText, setInputText] = useState('');
  const { user } = useUser();
  const [textToEncrypt, setTextToEncrypt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTextToEncrypt(inputText);
  };

  const handleEncrypt = async () => {
    try {
      const response = await fetch('http://localhost:8080/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plaintext: inputText,
          user: user.id,
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("data in encrypt:", data)
      setEncryptedTextBase64(atob(data.encryptedText));
      console.log("encrypted result:", data)
      setCipherText(atob(data.encryptedText))
    } catch (error) {
      console.error('Error encrypting text:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="container">
      <h2 className="title">Encrypt</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text to encrypt"
          className="input"
        />
        <button type="submit" className="button" onClick={handleEncrypt}>Encrypt</button>
      </form>

      {encryptedTextBase64 && <p>Your text {textToEncrypt} has been successfully encrypted! Your encrypted text is: {encryptedTextBase64}</p>}
      <p></p>
    </div>
  );
};

export default EncryptPage;
