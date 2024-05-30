import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StartQuiz = () => {
  const [quizResult, setQuizResult] = useState(null);
  const navigate = useNavigate();

  const handleQuizCompletion = (result) => {
    // Save result to the database
    fetch('http://localhost:8080/start-quiz-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ result })
    }).then(() => {
      setQuizResult(result);
      // Redirect to learning platform
      navigate('/learning-platform');
    });
  };

  return (
    <div>
      <h2>Start Quiz</h2>
      
      <button onClick={() => handleQuizCompletion(80)}>Complete Quiz with 80%</button>
    </div>
  );
};

export default StartQuiz;
