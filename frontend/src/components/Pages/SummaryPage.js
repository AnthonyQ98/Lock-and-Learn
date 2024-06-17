import React, { useEffect, useState } from 'react';

const SummaryPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:8080/get-summary');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSummary(data);
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
