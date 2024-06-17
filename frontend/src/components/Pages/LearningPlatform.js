import React, { useState } from 'react';
import './LearningPlatform.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Section = ({ title, content, image, reference }) => (
  <div className="section-container">
    {image && (
      <div className="image-container">
        <img
          src={image}
          alt="Visual representation"
          className="image"
        />
        {reference && <p className="referenceText">{reference}</p>}
      </div>
    )}
    <h3>{title}</h3>
    <div className="content">
      {content.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  </div>
);

const DetailBox = ({ sectionContent, onClick }) => {
  return (
    <button className="detail-box" onClick={() => onClick()}>
      Want more detail? Click me to ask AI
    </button>
  );
};


const LearningPlatform = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [inputText, setInputText] = useState('');
  const [encryptedTextBase64, setEncryptedTextBase64] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isKeyGenerated, setIsKeyGenerated] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const navigate = useNavigate();

  const sections = [
    {
      title: 'About me & the learning platform.',
      content: 'Hello there. My name is Anthony!\n\nI created this learning platform with a very specific objective: to simplify the learning process for encryption & decryption for entry level learners, enthusiasts, hobbyists.. you name it.\n\nOne thing that is very apparent to me about learning is that not everyone learns the same way, and although this is well known, there doesn\'t seem to be a great deal of ways people can learn about cryptography other than watch a video or read a book.\n\nI am a hands on learner. I need to be playing around with things, seeing things change, screens flash, images appear, to actually learn anything. Reading text on a page or listening to a video does not do much for me. So what did I do? Well, welcome to this learning platform where I aim to introduce cryptography (most notably the general encryption & decryption process) to you, the learner, in an easy to digest and interactive manner.\n\nThroughout each of the following sections, you will find a summary of the section, an explanation of what that specific section is covering, and my favourite part... a breakdown as if me and you were both five year olds trying to wrap our heads wrong the confusing and albeit intimidating world of cryptography. This is my favourite way to learn. If you can break things down to the point a five year old child can understand it... well, we have a pretty good chance at absorbing that information!\n\n\n\nLets get started!',
      image: "../../../../images/about_me.png"
    },
    {
      title: 'Introduction to Cryptography',
      content: 'The encryption process begins with selecting a strong encryption algorithm, such as AES, and generating a secret key. The plaintext data, which is the information to be protected, is then encrypted using the encryption algorithm and secret key. This produces ciphertext, which is the scrambled and unreadable form of the original data. The ciphertext can be safely transmitted or stored without revealing the original information.',
      image: "../../../../images/mind_blown.jpg",
    },
    {
      title: "Choosing your encryption algorithm", content: "As you can see above... there is a lot of algorithms available. And this isn't all of them. This is step one in the encryption process. You need to pick your encryption algorithm. The most common algorithms are AES, RSA, Twofish, DES and Blowfish. \n\nToday, we will be using AES-256. This is a secure encryption algorithm. Why? Well, over time, encryption algorithms can be found to have vulnerabilities that can be exploited by attackers. DES, for example, is an algorithm that is vulnerable to brute force attacks. What does this mean? Well, lets just think of a number between 1 and 1000. Well, if you have give anyone enough time and guesses, they will be able to guess your number.\n\nSo what is this 'AES-256' and what the hell is the 256 all about? Well, lets imagine I can give you a key. A key has all these very specific grooves that allow it to unlock specific locks. A key with no grooves is not much of a key. A key with a one or two grooves is also not very secure.. but one way we can ensure our key can't be easily replicated is to make it long & complicated. That is what 256 bit keys are. Long & complicated! There is much smaller keys, however, the goal here is security, so AES-256 is currently a very secure algorithm to use.\n\nTo get a more technical understanding, AES-256 is a symmetric (ie: only one key is used for encryption & decryption) encryption algorithm that uses a 256-bit key to help convert plain text into cipher text. Cipher text being the encrypted message.\n\nDoes the above make sense? Are you an encryption expert now? No? You shouldn't be. Lets move on and look at the process in more detail!",
      image: "../../../../images/encryption_algorithms.png",
      reference: "Reference: https://www.researchgate.net/figure/Overview-of-the-cryptographic-encryption-algorithms_fig1_321587376"
    },
    {
      title: 'Encryption Process',
      content: 'So you want to send a message to the President of the United States of America. It is classified and nobody else should be able to understand it, except for Mr. President himself. You and Mr President both have the same key to the Oval Office. But nobody else does (and nobody else knows what this key looks like, or how to re-create it). Well, you can just walk right into Mr. Presidents office (if the secret service allow you) and leave the message right on his desk then walk right out and lock the door. Now, anybody who wants to come along and read your message, they need to guess your key (which wont happen if you use AES256) before they can see this message.\n\nThe encryption process begins with selecting a strong encryption algorithm, which we have just done, and generating a secret key. The plaintext data, which is the information to be protected, at a very high level is converted into a number, and then we apply some mathematical formula to it, so it is then encrypted using the encryption algorithm and secret key. This produces ciphertext, which is the scrambled and unreadable form of the original data. The ciphertext can be safely transmitted or stored without revealing the original information.\n\nSo really whats going on here is RAW_TEXT + SECRET_KEY = CIPHER_TEXT. So if a hacker comes along and they have this cipher text... or a robber comes along and they want to break into your house with a key... well... how long will that take them without the key? And in our case... the key is EXTREMELY long and complicated. The answer is... beyond our lifetime, by a long shot. This is the principle of encryption.',
      image: "../../../../images/encryption_process.jpg",
      reference: "Reference: https://www.atpinc.com/blog/what-is-aes-256-encryption"
    },
    {
      title: 'Decryption Process',
      content: 'Mr. President comes home from playing golf and he takes the key that only he and you possess for the Oval Office. He lets himself in with ease in a few seconds (rather than a few thousand years if he had not got the key) and he finds your message. This is the decryption process explained as if you are a child. \n\nThe decryption process requires the same encryption algorithm and the corresponding secret key that were used for encryption. The ciphertext, obtained from storage or transmission, is decrypted using the decryption algorithm and secret key. This reverses the encryption process and transforms the ciphertext back into the original plaintext data. The decrypted plaintext can then be accessed and used as needed.',
      image: "../../../../images/decryption_process.png",
      reference: "Reference: https://www.siakabaro.com/how-to-perform-aes-encryption-in-net/"
    },
    {
      title: 'Key Management',
      content: 'Encryption & decryption is a very secure process of protecting data, however, it is only as secure as the key management solution in place to securely store these keys. If a malicious actor gets access to the encryption keys in use, they can easily decrypt our data, encrypt new data and behave as the original owner of that key, etc... this is why proper management of encryption keys is crucial for ensuring the security of encrypted data. Keys should be generated securely, stored in a secure key vault, and managed throughout their lifecycle. Key rotation, key revocation, and access control policies should be implemented to protect keys from unauthorized access and misuse.'
    }
  ];

  const handleDetailBoxClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/gemini-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sectionContent: sections[currentSection].content
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      const content = data.content;
      setAiResponse(content);
    } catch (error) {
      console.error('Error sending section content to AI:', error);
    }
  };

  const handleCompletedButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/gemini-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sectionContent: sections[currentSection].content
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      const content = data.content;
      setAiResponse(content);
    } catch (error) {
      console.error('Error sending section content to AI:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleCipherTextChange = (e) => {
    setCipherText(e.target.value);
  };

  const handleSecretKeyChange = (e) => {
    setSecretKey(e.target.value);
  };

  const handleEncrypt = async () => {
    try {
      const response = await fetch('http://localhost:8080/onetime-encryption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plaintext: inputText,
          key: btoa(secretKey)
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("data in encrypt:", data)
      setEncryptedTextBase64(atob(data.ciphertext_base64));
      console.log("encrypted result:", data)
      console.log("result in binary: ", atob(data.ciphertext_base64))
      setCipherText(atob(data.ciphertext_base64))
      setSecretKey(secretKey)
    } catch (error) {
      console.error('Error encrypting text:', error);
    }
  };

  const handleDecrypt = async () => {
    const bodyReq = JSON.stringify({
      ciphertext: btoa(cipherText), // this is base 64
      key: btoa(secretKey)
    })
    console.log("body of decrypt request: ", bodyReq)
    try {
      const response = await fetch('http://localhost:8080/onetime-decryption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: bodyReq
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDecryptedText(data.plaintext);
    } catch (error) {
      console.error('Error decrypting text:', error);
    }
  };

  const generateSecretKey = async () => {
    try {
      const response = await fetch(`http://localhost:8080/onetime-secret-key`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const key = data.key; // note the key is base64 encoded during the response from the go backend.
      setSecretKey(atob(key));
      setIsKeyGenerated(true);
      console.log("temp key created: ", atob(key))
    } catch (error) {
      console.error('Error generating new secret key:', error);
      setIsKeyGenerated(false)
      setSecretKey("UNAVAILABLE_ENDPOINT")
    }
  };

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setAiResponse("");
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setAiResponse("");
    }
  };

  return (
    <div className="learning-platform">
      <h2>Learning Platform</h2>
      <div className="section">
        {currentSection === 3 ? (
          <div>
            <Section {...sections[currentSection]} />
            <p>Let's get a secret key and encrypt some text.</p>
            <button onClick={generateSecretKey}>Generate Secret Key</button>
            {secretKey && <p>Nice! Your secret key is: {secretKey}</p>}{secretKey && <p>Next up... lets encrypt some text using that exact secret key!</p>}
            {isKeyGenerated && (
              <>
                <textarea
                  placeholder="Enter text to encrypt..."
                  value={inputText}
                  onChange={handleInputChange}
                />
                <br /><br />
                <button onClick={handleEncrypt}>Encrypt Text</button>
                {encryptedTextBase64 && <p>And here is the base64 output of your encrypted text: {encryptedTextBase64}</p>}
              </>
            )}
          </div>
        ) : currentSection === 4 ? (
          <div>
            <Section {...sections[currentSection]} />
            <p>We have added your secret key and cipher text that you generated from the previous slide....</p>
            <label value={cipherText}>Cipher Text:  </label>
            <textarea
              placeholder="Paste your cipher text here..."
              value={cipherText}
              onChange={handleCipherTextChange}
              cols={50}
              rows={1}
            />
            <br /><br />
            <label value={secretKey}>Secret Key:  </label>
            <textarea
              placeholder="Paste your secret key here..."
              value={secretKey}
              onChange={handleSecretKeyChange}
              cols={50}
              rows={1}
            />
            <br /><br />
            <button onClick={handleDecrypt}>Decrypt Text</button>
            {decryptedText && <p>Your decrypted text is: {decryptedText}</p>}
            {decryptedText && <p>Play around with the above and see what happens when you delete characters from the secret key. What do you think will happen? The key won't match the same key that was used to generate the cipher text anymore...</p>}
          </div>
        ) : (
          <Section {...sections[currentSection]} />
        )}

        {currentSection !== 0 && aiResponse && (
          <div className="section">
            <h3>AI Response (powered by Google Gemini)</h3>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>
      <div className="navigation">
        <div className="arrow-container">
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
        {currentSection !== 0 && (
          <button className="arrow-button" onClick={handleDetailBoxClick}>Confused? Ask AI for more info</button>
        )}
        {currentSection === sections.length - 1 && (
          <button className="arrow-button" onClick={navigate("/end-quiz")}>
            <a href="/end-quiz" style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%', height: '100%' }}>Complete the final quiz</a>
          </button>
        )}
      </div>
    </div>
  );
};


export default LearningPlatform;
