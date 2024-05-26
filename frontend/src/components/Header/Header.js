import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext/UserContext';
import './Header.css';

const Header = () => {
  const { isLoggedIn, resetUser } = useUser();
  const navigate = useNavigate();

  const handleSignOut = () => {
    resetUser();
    navigate('/'); // Redirect to home page after signing out
  };

  const handleSignIn = () => {
    window.location.href = 'http://localhost:8080/google_login';
  };

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
            <>
              <li className="nav-item"><Link to="/profile" className="nav-link">Profile</Link></li>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={handleSignOut}>Sign Out</Link>
              </li>
              <li className="nav-item"><Link to="/encrypt" className="nav-link">Encrypt</Link></li>
          <li className="nav-item"><Link to="/decrypt" className="nav-link">Decrypt</Link></li>
          <li className="nav-item"><Link to="/quiz" className="nav-link">Quiz</Link></li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" onClick={handleSignIn}>Log in</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
