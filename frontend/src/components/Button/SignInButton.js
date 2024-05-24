import React from 'react';

const SignInButton = ({ onSignIn }) => {
    console.log('onSignIn prop:', onSignIn);
  const handleSignIn = async () => {
    if (typeof onSignIn === 'function') {
      onSignIn();
    } else {
      console.error('onSignIn function is not provided.');
    }
  };

  return (
    <button onClick={handleSignIn}>Sign In</button>
  );
};

export default SignInButton;
