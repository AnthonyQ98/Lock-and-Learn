import React, { useState } from 'react';
import './LearningPlatform.css';

const Section = ({ title, content }) => (
  <div>
    <h3>{title}</h3>
    {content.split('\n').map((line, index) => (
      <p key={index}>{line}</p>
    ))}
  </div>
);

const LearningPlatform = () => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: 'About me & the learning platform.',
      content: 'Hello there. My name is Anthony, I am a Higher Diploma student at the National College of Ireland and a Security Engineer at Salesforce.\n\nI created this learning platform with a very specific objective: to simplify the learning process for encryption & decryption to entry level learners, enthusiasts, hobbyists.. you name it.\n\nOne thing that is very apparent to me about learning is that not everyone learns the same way, and although this is well known, there doesn\'t seem to be a great deal of ways people can learn about cryptography other than watch a video or read a book.\n\nI am a hands on learner. I need to be playing around with things, seeing things change, screens flash, images appear, to actually learn anything. Reading text on a page or listening to a video does not do much for me. So what did I do? Well, welcome to this learning platform where I aim to introduce cryptography (most notably the general encryption & decryption process) to you, the learner, in an easy to digest and interactive manner.\n\nThroughout each of the following sections, you will find a summary of the section, an explanation of what that specific section is covering, and my favourite part... a breakdown as if me and you were both five year olds trying to wrap our heads wrong the confusing and albeit intimidating world of cryptography. This is my favourite way to learn. If you can break things down to the point a five year old child can understand it... well, we have a pretty good chance at absorbing that information!\n\n\n\nLets get started!'
    },
    {
      title: 'Introduction to Cryptography',
      content: 'The encryption process begins with selecting a strong encryption algorithm, such as AES, and generating a secret key. The plaintext data, which is the information to be protected, is then encrypted using the encryption algorithm and secret key. This produces ciphertext, which is the scrambled and unreadable form of the original data. The ciphertext can be safely transmitted or stored without revealing the original information.'
    },
    {
      title: 'Encryption Process',
      content: 'The encryption process begins with selecting a strong encryption algorithm, such as AES, and generating a secret key. The plaintext data, which is the information to be protected, is then encrypted using the encryption algorithm and secret key. This produces ciphertext, which is the scrambled and unreadable form of the original data. The ciphertext can be safely transmitted or stored without revealing the original information.'
    },
    {
      title: 'Decryption Process',
      content: 'The decryption process requires the same encryption algorithm and the corresponding secret key that were used for encryption. The ciphertext, obtained from storage or transmission, is decrypted using the decryption algorithm and secret key. This reverses the encryption process and transforms the ciphertext back into the original plaintext data. The decrypted plaintext can then be accessed and used as needed.'
    },
    {
      title: 'Key Management',
      content: 'Encryption & decryption is a very secure process of protecting data, however, it is only as secure as the key management solution in place to securely store these keys. If a malicious actor gets access to the encryption keys in use, they can easily decrypt our data, encrypt new data and behave as the original owner of that key, etc... this is why proper management of encryption keys is crucial for ensuring the security of encrypted data. Keys should be generated securely, stored in a secure key vault, and managed throughout their lifecycle. Key rotation, key revocation, and access control policies should be implemented to protect keys from unauthorized access and misuse.'
    }
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
      <div className="section">
        <Section {...sections[currentSection]} />
      </div>
      <div className="navigation">
        {currentSection > 0 && (
          <button className="arrow-button" onClick={goToPreviousSection}>
            &lt; Previous
          </button>
        )}
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