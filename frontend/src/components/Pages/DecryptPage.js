import React, { useState } from 'react';
import './DecryptPage.css';
import { useUser } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';

const DecryptPage = ({ onDecrypt }) => {
  const [text, setText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [inputText, setInputText] = useState('');
  const { user } = useUser();
  const [textToDecrypt, setTextToDecrypt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTextToDecrypt(inputText);
  };

  const handleDecrypt = async () => {
    try {
      const response = await fetch('http://localhost:8080/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ciphertext: btoa(inputText),
          user: user.id,
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("data in decrypt:", data)
      setDecryptedText(atob(data.plaintext));
      console.log("decrypted result:", data)
      setCipherText(atob(data.plaintext))
    } catch (error) {
      console.error('Error decrypt text:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const navigateToEncrypt = () => {
    navigate("/encrypt")
  };

  return (
    <div className="container">
      <h2 className="title">Decrypt</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text to decrypt"
          className="input"
        />
        <button type="submit" className="button" onClick={handleDecrypt}>Decrypt</button>
      </form>

      {decryptedText && (
      <div>
      <p>Your cipher text {textToDecrypt} has been successfully decrypted! Your decrypted text is: {decryptedText}</p>
      <button className="button" onClick={navigateToEncrypt}>Encrypt more text</button>
      </div>)}
      <p></p>
    </div>
  );
};

export default DecryptPage;
