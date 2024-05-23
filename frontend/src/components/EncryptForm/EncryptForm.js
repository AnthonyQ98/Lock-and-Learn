import React, { useState } from 'react';
import TextInput from '../TextInput/TextInput';
import Button from '../Button/Button';
import './EncryptForm.css';

const EncryptForm = ({ onEncrypt }) => {
  const [text, setText] = useState('');

  const handleEncryptClick = () => {
    onEncrypt(text);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="encrypt-form">
      <h2>Encrypt Text</h2>
      <TextInput value={text} onChange={handleTextChange} />
      <Button onClick={handleEncryptClick}>Encrypt</Button>
    </div>
  );
};

export default EncryptForm;
