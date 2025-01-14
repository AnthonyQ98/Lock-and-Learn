import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext/UserContext';

const LoginCallback = () => {
  const { setUserContext } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const key = urlParams.get('key');

    if (id && name && email && key) {
      const userData = { id, name, email, key };
      console.log('User data from callback:', userData);

      // Set user context with the extracted user data
      setUserContext(userData);

      // Redirect to the home page or profile page
      navigate('/');
    } else {
      console.error('Missing query parameters in the callback URL');
      // Handle missing parameters, e.g., redirect to an error page
    }
  }, [setUserContext, navigate]);

  return <div>Loading...</div>;
};

export default LoginCallback;
