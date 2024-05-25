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
