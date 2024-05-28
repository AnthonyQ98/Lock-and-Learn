import React, { useState } from 'react';
import './DecryptPage.css';

const DecryptPage = ({ onDecrypt }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDecrypt(text);
  };

  return (
    <div className="container">
      <h2 className="title">Decrypt & Learn</h2>

      {/* NEED TO ADD LEARNING PLATFORM DIALOGS TO EXPLAIN THE ENCRYPTION
      
      1. Check if user has decrypted before (check db against their oauth id)
      2. Is there an entry? If so, allow them to decrypt + show learning
      3. Is there not an entry in the db? Direct them to do the quiz first.
      4. tbd
      
      */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to decrypt"
          className="input"
        />
        <button type="submit" className="button">Decrypt</button>
      </form>
    </div>
  );
};

export default DecryptPage;
