import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizPages.css';
import { useUser } from '../UserContext/UserContext';

const StartQuiz = () => {
  const [quizResult, setQuizResult] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const { user } = useUser();

  const questions = [
    {
        question: "Which type of encryption uses a pair of keys, one for encryption and one for decryption?",
        options: ["Symmetric", "Asymmetric", "Block", "Stream"],
        correctAnswer: "Asymmetric"
    },
    {
      question: "What does AES stand for?",
      options: ["Advanced Encryption Standard", "Advanced Encrypting System", "Algorithmic Encryption Standard", "Authenticated Encryption System"],
      correctAnswer: "Advanced Encryption Standard"
    },
    {
      question: "Which mode of operation is commonly used with AES for secure data encryption?",
      options: ["ECB (Electronic Codebook)", "CBC (Cipher Block Chaining)", "CTR (Counter Mode)", "OFB (Output Feedback)"],
      correctAnswer: "CBC (Cipher Block Chaining)"
    },
    {
      question: "Which type of key does AES-256 use?",
      options: ["Symmetric", "Asymmetric", "Public", "Private"],
      correctAnswer: "Symmetric"
    },
    {
      question: "In the AES encryption process, what is the main function of the 'MixColumns' step?",
      options: ["To add confusion by mixing the bytes", "To provide diffusion by mixing the columns of the state", "To XOR the plaintext with the key", "To expand the key"],
      correctAnswer: "To provide diffusion by mixing the columns of the state"
    },
    {
        question: "What is ciphertext?",
        options: ["Encrypted data", "Compressed data", "Readable data", "Hashed data"],
        correctAnswer: "Encrypted data"
      },
      {
        question: "In encryption, what is a key?",
        options: ["A password used to access data", "A random string of characters used to encrypt and decrypt data", "A method of compressing data", "A type of hash function"],
        correctAnswer: "A random string of characters used to encrypt and decrypt data"
      },
      {
        question: "What does the process of decryption do?",
        options: ["Transforms ciphertext back into plaintext", "Transforms plaintext into ciphertext", "Compresses data", "Hashes data"],
        correctAnswer: "Transforms ciphertext back into plaintext"
      },
  ];

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers({
      ...answers,
      [questionIndex]: selectedOption
    });
  };

  const calculateResult = () => {
    let correctAnswersCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswersCount += 1;
      }
    });
    console.log('Correct answers count:', correctAnswersCount);
    console.log('Total number of questions:', questions.length);
  
    const percentageScore = (correctAnswersCount / questions.length) * 100;
    console.log('Percentage score:', percentageScore);
  
    return percentageScore;
  };

  const handleQuizCompletion = () => {
    const result = { result: calculateResult(), user_id: user.id, quiz_type: "start" };
    console.log("result: ", result)
    // Make request to quiz-result endpoint on backend with result JSON data.
    fetch('http://localhost:8080/quiz-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    }).then(() => {
      setQuizResult(result);
      // Redirect to learning platform
      navigate('/learning-platform');
    });
  };


  return (
    <div className="quiz-container">
      <h2 className="quiz-header">Start quiz</h2>
      <h3 className="quiz-subtitle">Lets gather an understanding of where you're at before using the platform!</h3>
      {questions.map((question, index) => (
        <div key={index} className="quiz-question">
          <p>{question.question}</p>
          <ul className="quiz-options">
            {question.options.map((option, optionIndex) => (
              <li key={optionIndex} className="quiz-option">
                <label>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button className="quiz-button" onClick={handleQuizCompletion}>Complete Quiz</button>
    </div>
  );
};
export default StartQuiz;
