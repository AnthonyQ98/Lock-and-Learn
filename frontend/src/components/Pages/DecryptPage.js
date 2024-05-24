import React, { useState } from 'react';

const DecryptForm = ({ onDecrypt }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDecrypt(text);
  };

  return (
    <div>
      <h2>Decrypt & Learn</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to decrypt"
        />
        <button type="submit">Decrypt</button>
      </form>
    </div>
  );
};

export default DecryptForm;
