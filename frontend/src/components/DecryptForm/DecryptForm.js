import React, { useState } from 'react';
import TextInput from '../TextInput/TextInput';
import Button from '../Button/Button';
import './DecryptForm.css';

const DecryptForm = ({ onDecrypt }) => {
  const [text, setText] = useState('');

  const handleDecryptClick = () => {
    onDecrypt(text);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="decrypt-form">
      <h2>Decrypt Text</h2>
      <TextInput value={text} onChange={handleTextChange} />
      <Button onClick={handleDecryptClick}>Decrypt</Button>
    </div>
  );
};

export default DecryptForm;
