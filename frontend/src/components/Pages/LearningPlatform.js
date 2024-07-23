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
      title: 'About Me & the Learning Platform',
      content: `Hello there. My name is Anthony!
  
      I created this learning platform with a specific objective: to simplify the learning process for encryption and decryption for entry-level learners, enthusiasts, and hobbyists. Learning about cryptography can often be dry and intimidating, so I designed this platform to make it engaging and interactive.
  
      I believe that not everyone learns the same way. While some may find reading or watching videos sufficient, others, like me, need to interact with the material to truly understand it. This platform aims to introduce cryptography, focusing on encryption and decryption, in a manner that's easy to digest and interactive.
  
      Each section will include a summary, an explanation, and a simplified breakdown, as if we're both five-year-olds trying to understand cryptography. This method helps in grasping complex concepts by breaking them down into understandable pieces. Let's get started!`,
      image: "../../../../images/about_me.png"
    },
    {
      title: 'Introduction to Cryptography',
      content: `Cryptography is the science of protecting information by transforming it into an unreadable format called ciphertext. This is done to ensure that only authorized parties can access the original data.
  
      AES (Advanced Encryption Standard):
      - AES is a symmetric encryption algorithm, which means the same key is used for both encryption and decryption.
      - It is widely used due to its strength and efficiency in protecting sensitive data.
  
      How AES Works:
      - Encryption: Converts plaintext (readable data) into ciphertext (unreadable data) using a key and algorithm.
      - Decryption: Converts ciphertext back into plaintext using the same key.
  
      Common Modes of Operation with AES:
      - CBC (Cipher Block Chaining): A mode where each block of plaintext is XORed with the previous ciphertext block before being encrypted. This mode provides better security than ECB (Electronic Codebook) by ensuring that identical plaintext blocks result in different ciphertext blocks.
      
      - ECB (Electronic Codebook): Encrypts each block of plaintext independently. This mode is less secure because identical plaintext blocks produce identical ciphertext blocks, which can reveal patterns in the data.
  
      Summary:
      - Symmetric Encryption: Uses one key for encryption and decryption.
      - AES: A popular symmetric encryption standard.
      - CBC: A commonly used mode of operation with AES, providing enhanced security over ECB.`,
      image: "../../../../images/mind_blown.jpg"
    },
    {
      title: "Choosing Your Encryption Algorithm",
      content: `There are many encryption algorithms available, such as AES, RSA, Twofish, DES, and Blowfish. 
  
      AES-256 is a secure encryption algorithm and is the focus here. The '256' refers to the size of the encryption key, which is 256 bits long. A longer and more complex key enhances security. For example, DES (Data Encryption Standard) has been found vulnerable to brute-force attacks due to its shorter key length.
  
      AES-256:
      - Symmetric Algorithm: Uses the same key for encryption and decryption.
      - 256-bit Key: Provides strong security by making the key complex and hard to guess.
  
      AES-256 ensures that even if attackers try to guess the key, it would take an impractically long time to succeed due to its complexity.`,
      image: "../../../../images/encryption_algorithms.png",
      reference: "Reference: https://www.researchgate.net/figure/Overview-of-the-cryptographic-encryption-algorithms_fig1_321587376"
    },
    {
      title: 'Encryption Process',
      content: `The encryption process involves several steps to secure data:
  
      1. Choosing an Encryption Algorithm: AES is selected for its robust security features.
      
      2. Generating a Secret Key: A unique key is used to encrypt and decrypt the data.
      
      3. Encrypting Plaintext**: Plaintext is converted into ciphertext using AES and the secret key. This process involves several steps:
  
      AES Encryption Steps:
      - SubBytes: Each byte of the plaintext is replaced with another byte according to a predefined table (S-box).
      - ShiftRows: Rows of the state are shifted to the left to provide diffusion.
      - MixColumns: Columns of the state are mixed to provide further diffusion. This step helps ensure that each byte of the ciphertext depends on many bytes of the plaintext and the key.
      - AddRoundKey: Each byte of the state is XORed with a round key derived from the original key.
  
      Function of MixColumns:
      - MixColumns: This step mixes the bytes of each column in the state matrix to ensure that each byte affects multiple bytes of the ciphertext. It provides diffusion by spreading the influence of each byte across the entire column.
  
      Example:
      - Imagine sending a classified message. Encryption ensures that only authorized recipients with the correct key can read the message. The ciphertext generated by encryption is secure against unauthorized access.
  
      Summary:
      - Encryption: Converts readable data into an unreadable format.
      - MixColumns: Enhances security by mixing bytes to ensure thorough diffusion.`,
      image: "../../../../images/encryption_process.jpg",
      reference: "Reference: https://www.atpinc.com/blog/what-is-aes-256-encryption"
    },
    {
      title: 'Decryption Process',
      content: `Decryption is the reverse process of encryption:
  
      1. Using the Same Algorithm and Key: Decryption requires the same AES algorithm and secret key used for encryption.
  
      2. Converting Ciphertext to Plaintext: The ciphertext is processed to revert it back to the original readable format. This involves the inverse steps of encryption:
  
      AES Decryption Steps:
      - InvSubBytes: Each byte of the ciphertext is replaced with the corresponding byte from the inverse S-box.
      - InvShiftRows: Rows of the state are shifted to the right.
      - InvMixColumns: Columns of the state are mixed in the reverse manner to the encryption process.
      - AddRoundKey: Each byte of the state is XORed with the round key used during encryption.
  
      Example:
      - After encrypting a message, the recipient uses the same key to decrypt and read it. This ensures that only the intended recipient can access the original content.
  
      Summary:
      - Decryption: Reverts ciphertext back into plaintext.
      - Inverse Operations: The decryption steps reverse the encryption process.`,
      image: "../../../../images/decryption_process.png",
      reference: "Reference: https://www.siakabaro.com/how-to-perform-aes-encryption-in-net/"
    },
    {
      title: 'Key Management',
      content: `Proper key management is crucial for maintaining the security of encrypted data. 
  
      Even the strongest encryption is vulnerable if the keys are not managed securely. Keys should be:
      - Generated Securely: Using strong methods.
      - Stored in a Secure Vault: To prevent unauthorized access.
      - Managed Throughout Their Lifecycle: Including key rotation and revocation.
  
      Key Management:
      - Ensures that keys are protected and not compromised.
      - Involves practices like key rotation and access control to secure data effectively.`
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
            <h3>AI Response (powered by Gemini)</h3>
            <div dangerouslySetInnerHTML={{ __html: aiResponse }} />
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
            Complete the final quiz
          </button>
        )}
      </div>
    </div>
  );
};


export default LearningPlatform;
