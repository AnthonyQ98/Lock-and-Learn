import React from 'react';
import './TextInput.css';

const TextInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="text-input"
      value={value}
      onChange={onChange}
    />
  );
};

export default TextInput;