import React, { useState } from 'react';
import './LearningPlatform.css';

const LearningPlatform = () => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' },
  ];

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="learning-platform">
      <h2>Learning Platform</h2>
      {/* Current section */}
      <div className="section">
        <h3>{sections[currentSection].title}</h3>
        <p>{sections[currentSection].content}</p>
      </div>

      <div className="navigation">
        {/* Previous section button */}
        {currentSection > 0 && (
          <button className="arrow-button" onClick={goToPreviousSection}>
            &lt; Previous
          </button>
        )}
        {/* Next section button */}
        {currentSection < sections.length - 1 && (
          <button className="arrow-button" onClick={goToNextSection}>
            Next &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default LearningPlatform;