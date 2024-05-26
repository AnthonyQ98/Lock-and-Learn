import React from 'react';

const SignInButton = ({ onSignIn }) => { // Receive onSignIn function as props
  const handleSignIn = async () => {
    // Ensure onSignIn function is provided
    if (typeof onSignIn === 'function') {
      onSignIn(); // Invoke onSignIn function if it's provided
    } else {
      console.error('onSignIn function is not provided.');
    }
  };

  return (
    <button onClick={handleSignIn}>Sign In</button>
  );
};

export default SignInButton;