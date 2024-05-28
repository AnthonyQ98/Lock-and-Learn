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

      {/* NEED TO ADD LEARNING PLATFORM DIALOGS TO EXPLAIN THE ENCRYPTION
      
      1. Check if user has encrypted before (check db against their oauth id)
      2. Is there an entry? If so, allow them to encrypt + show learning
      3. Is there not an entry in the db? Direct them to do the quiz first.
      4. tbd
      
      */}

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
