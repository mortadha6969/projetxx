import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

// Helper function to check if user is logged in
const isLoggedIn = () => {
  return !!localStorage.getItem('token'); // Return true if token exists, otherwise false
};

const Navbar = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Campaign", path: "/campaign" },
    { name: "Fundraiser", path: "/fundraiser" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar">
        <div className="nav-left">
          <Logo />
          <div className="nav-buttons-up">
            {navItems.map((item, index) => (
              <Link className="Min-Menu-up" to={item.path} key={index}>
                <button className="nav-button-up">
                  {item.name}
                </button>
              </Link>
            ))}
          </div>
        </div>
        <div className="nav-right">
          {!isLoggedIn() && <LoginButton />}
          {!isLoggedIn() && <RegisterButton />}
          {isLoggedIn() && <LogoutButton />}
          {isLoggedIn() && <ProfileButton />}
        </div>
      </div>
      <div className="nav-buttons-down">
        {navItems.map((item, index) => (
          <Link className="Min-Menu-down" to={item.path} key={index}>
            <button className="nav-button-item">
              {item.name}
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <Link className="logo-button" to="/">
        <span className="logo-text">TrueFunding</span>
        <span className="logo-symbol">®</span>
      </Link>
    </div>
  );
};

const LoginButton = () => {
  return (
    <Link className="button3" to="/Login">
      <button className="Login-button">
        <span className="Login-text">Login</span>
        <span className="Login-icon">→</span>
      </button>
    </Link>
  );
};

const RegisterButton = () => {
  return (
    <Link className="button1" to="/Register">
      <button className="Register-button">
        <span className="Register-text">Register</span>
        <span className="Register-icon">→</span>
      </button>
    </Link>
  );
};

const ProfileButton = () => {
  return (
    <Link className="button2" to="/ProfileAccountPage">
      <button className="Profile-button">
        <span className="Profile-icon">👤</span>
      </button>
    </Link>
  );
};

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <button className="Logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Navbar;
