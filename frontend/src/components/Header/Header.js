import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, onSignIn }) => {
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="home-link">
          <i className="fas fa-home"></i>
        </Link>
      </div>
      <nav className="nav">
        <ul className="nav-list">
          {isLoggedIn ? (
            <li className="nav-item"><Link to="/user" className="nav-link">Profile</Link></li>
          ) : (
            <li className="nav-item"><button className="nav-link" onClick={onSignIn}>Log in</button></li>
          )}
          <li className="nav-item"><Link to="/encrypt" className="nav-link">Encrypt</Link></li>
          <li className="nav-item"><Link to="/decrypt" className="nav-link">Decrypt</Link></li>
          <li className="nav-item"><Link to="/quiz" className="nav-link">Quiz</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
