import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext/UserContext';

const SummaryPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`http://localhost:8080/get-summary?oauthid=${user.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        console.log("summary: ", data)
        const parsedSummary = {
            firstQuizResult: parseFloat(data.firstQuizResult),
            endQuizResult: parseFloat(data.endQuizResult),
            difference: parseFloat(data.difference),
            improvementPercentage: parseFloat(data.improvementPercentage)
          };

        setSummary(parsedSummary);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Quiz Summary</h1>
      {summary ? (
        <div>
          <p>First Quiz Result: {summary.firstQuizResult}%</p>
          <p>End Quiz Result: {summary.endQuizResult}%</p>
          <p>Difference: {summary.difference}%</p>
          <p>Improvement: {summary.improvementPercentage}%</p>
        </div>
      ) : (
        <div>No summary available</div>
      )}
    </div>
  );
};

export default SummaryPage;
