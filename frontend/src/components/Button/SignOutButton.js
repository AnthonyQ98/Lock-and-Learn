import React, { useContext } from 'react';
import { UserContext } from '../UserContext/UserContext';

const SignOutButton = () => {
  const { signOut } = useContext(UserContext);

  return (
    <button onClick={signOut}>Sign Out</button>
  );
};

export default SignOutButton;