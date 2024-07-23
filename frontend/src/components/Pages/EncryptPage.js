import React, { useState } from 'react';
import './EncryptPage.css';
import { useUser } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';

const EncryptPage = ({ onEncrypt }) => {
  const [text, setText] = useState('');
  const [encryptedTextBase64, setEncryptedTextBase64] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [inputText, setInputText] = useState('');
  const { user } = useUser();
  const [textToEncrypt, setTextToEncrypt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTextToEncrypt(inputText);
  };

  const handleEncrypt = async () => {

    console.log("user.id: ", user.id)
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
        console.log("data in encrypt:", data);


        const encryptedTextBase64 = data.ciphertext_base64;
      
        setEncryptedTextBase64(atob(encryptedTextBase64)); 
    } catch (error) {
        console.error('Error encrypting text:', error);
    }
};

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const navigateToDecrypt = () => {
    navigate("/decrypt")
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encryptedTextBase64).then(() => {
      alert('Encrypted text copied to clipboard!');
    }, () => {
      alert('Failed to copy text.');
    });
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

      {encryptedTextBase64 && (
        <div>
          <p>Your text {textToEncrypt} has been successfully encrypted! Your encrypted text is: {encryptedTextBase64}</p>
          <button className="button" onClick={handleCopy}>Copy</button><br/><br/><br/>
          <button className="button" onClick={navigateToDecrypt}>Decrypt Text</button>
        </div>
      )}
      <p></p>
    </div>
  );
};

export default EncryptPage;
