import React, { useState } from 'react';
import './EncryptPage.css';

const EncryptPage = ({ onEncrypt }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onEncrypt(text);
  };

  return (
    <div className="container">
      <h2 className="title">Encrypt & Learn</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to encrypt"
          className="input"
        />
        <button type="submit" className="button">Encrypt</button>
      </form>
    </div>
  );
};

export default EncryptPage;
