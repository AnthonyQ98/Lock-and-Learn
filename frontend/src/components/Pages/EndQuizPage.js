import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EndQuiz = () => {
  const [quizResult, setQuizResult] = useState(null);
  const navigate = useNavigate();

  const handleQuizCompletion = (result) => {
    // Save result to the database
    fetch('http://localhost:8080/end-quiz-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ result })
    }).then(() => {
      setQuizResult(result);
      // Redirect to user page or wherever
      navigate('/user');
    });
  };

  return (
    <div>
      <h2>End Quiz</h2>
      {/* Implement the quiz form here */}
      <button onClick={() => handleQuizCompletion(90)}>Complete Quiz with 90%</button>
    </div>
  );
};

export default EndQuiz;
