import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="https://www.linkedin.com/in/anthony-quinn-ireland/" className="nav-link">About The Developer</Link></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
