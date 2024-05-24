import React, { useState } from 'react';

const EncryptForm = ({ onEncrypt }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onEncrypt(text);
  };

  return (
    <div>
      <h2>Encrypt & Learn</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to encrypt"
        />
        <button type="submit">Encrypt</button>
      </form>
    </div>
  );
};

export default EncryptForm;
