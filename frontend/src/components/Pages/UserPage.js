import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../UserContext/UserContext';
import './UserPage.css';

const UserPage = () => {
  const location = useLocation();
  const { user } = useUser();
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem('userData');
    return storedUserData ? JSON.parse(storedUserData) : null;
  });
  const [key, setKey] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loadingKey, setLoadingKey] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorKey, setErrorKey] = useState(null);
  const [errorSummary, setErrorSummary] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedData = queryParams.get('data');

    if (encodedData) {
      try {
        const decodedData = decodeURIComponent(encodedData);
        const parsedData = JSON.parse(decodedData);
        setUserData(parsedData);
        localStorage.setItem('userData', JSON.stringify(parsedData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [location.search]);

  useEffect(() => {
    const fetchKey = async () => {
      if (!user || !user.id) {
        setErrorKey(new Error('User is not available'));
        setLoadingKey(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/key`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: user.id }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setKey(data.key);
      } catch (error) {
        setErrorKey(error);
      } finally {
        setLoadingKey(false);
      }
    };

    const fetchSummary = async () => {
      if (!user || !user.id) {
        setErrorSummary(new Error('User is not available'));
        setLoadingSummary(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/get-summary?oauthid=${user.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const parsedSummary = {
          firstQuizResult: parseFloat(data.firstQuizResult),
          endQuizResult: parseFloat(data.endQuizResult),
          difference: parseFloat(data.difference),
          improvementPercentage: parseFloat(data.improvementPercentage),
        };
        setSummary(parsedSummary);
      } catch (error) {
        setErrorSummary(error);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchKey();
    fetchSummary();
  }, [user]);

  return (
    <div className="container">
      <h2 className="title">User Page</h2>
      {userData && (
        <div className="userInfo">
          <p>ID: {userData.id}</p>
          <p>Email: {userData.email}</p>
          <p>Name: {userData.name}</p>
        </div>
      )}
      {loadingKey ? (
        <div className="loading">Loading key...</div>
      ) : errorKey ? (
        <div className="error">Error: {errorKey.message}</div>
      ) : key ? (
        <div className="keyInfo">
          <p>Encryption key attached to your OAuth ID: {key}</p>
        </div>
      ) : (
        <div className="keyInfo">No key available</div>
      )}
      {loadingSummary ? (
        <div className="loading">Loading summary...</div>
      ) : errorSummary ? (
        <div className="error">Error: {errorSummary.message}</div>
      ) : summary ? (
        <div className="summaryInfo">
          <h3>Quiz Summary</h3>
          <p>First Quiz Result: {summary.firstQuizResult}%</p>
          <p>End Quiz Result: {summary.endQuizResult}%</p>
          <p>Difference: {summary.difference}%</p>
          <p>Improvement: {summary.improvementPercentage}%</p>
        </div>
      ) : (
        <div className="summaryInfo">No summary available</div>
      )}
    </div>
  );
};

export default UserPage;
