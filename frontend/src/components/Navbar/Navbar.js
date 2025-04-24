import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Campaigns", path: "/campaign" },
    { name: "Create Campaign", path: "/create-campaign", requiresAuth: true },
  ];

  // Filter nav items based on authentication status
  const filteredNavItems = navItems.filter(item =>
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar">
        <div className="nav-left">
          <Logo />
          <div className="nav-buttons-up">
            {filteredNavItems.map((item, index) => (
              <Link
                className={`Min-Menu-up ${location.pathname === item.path ? 'active' : ''}`}
                to={item.path}
                key={index}
              >
                <button className="nav-button-up">
                  {item.name}
                </button>
              </Link>
            ))}
          </div>
        </div>
        <div className="nav-right">
          {!isAuthenticated ? (
            <>
              <LoginButton />
              <RegisterButton />
            </>
          ) : (
            <>
              <LogoutButton onLogout={logout} />
              <ProfileButton username={currentUser?.username} />
            </>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav-buttons-down ${mobileMenuOpen ? 'open' : ''}`}>
        {filteredNavItems.map((item, index) => (
          <Link
            className={`Min-Menu-down ${location.pathname === item.path ? 'active' : ''}`}
            to={item.path}
            key={index}
          >
            <button className="nav-button-item">
              {item.name}
            </button>
          </Link>
        ))}

        {/* Add auth buttons to mobile menu */}
        <div className="mobile-auth-buttons">
          {!isAuthenticated ? (
            <>
              <Link className="Min-Menu-down" to="/login">
                <button className="nav-button-item">Login</button>
              </Link>
              <Link className="Min-Menu-down" to="/register">
                <button className="nav-button-item">Register</button>
              </Link>
            </>
          ) : (
            <>
              <Link className="Min-Menu-down" to="/profile">
                <button className="nav-button-item">Profile</button>
              </Link>
              <button
                className="nav-button-item logout-mobile"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}
        </div>
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
    <Link className="button3" to="/login">
      <button className="Login-button">
        <span className="Login-text">Login</span>
        <span className="Login-icon">→</span>
      </button>
    </Link>
  );
};

const RegisterButton = () => {
  return (
    <Link className="button1" to="/register">
      <button className="Register-button">
        <span className="Register-text">Register</span>
        <span className="Register-icon">→</span>
      </button>
    </Link>
  );
};

const ProfileButton = ({ username }) => {
  return (
    <Link className="button2" to="/profile">
      <button className="Profile-button" title={username || 'Profile'}>
        <span className="Profile-icon">👤</span>
        {username && <span className="username-display">{username}</span>}
      </button>
    </Link>
  );
};

const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <button className="Logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Navbar;
