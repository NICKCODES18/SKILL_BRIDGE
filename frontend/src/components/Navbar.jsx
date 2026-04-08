import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span>Skill<strong>Bridge</strong></span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/services" className="nav-link" onClick={() => setMenuOpen(false)}>Browse</Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/bookings" className="nav-link" onClick={() => setMenuOpen(false)}>Bookings</Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link nav-link-admin" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <div className="nav-user">
                <span className="nav-user-name">{user?.name}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
