import React, { useState } from "react";

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogin = () => {
    setIsLoggedIn(true); // Simulate login
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Simulate logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container p-1">
        {/* Navbar Brand */}
        <a className="navbar-brand fs-3" href="#">
          Navbar
        </a>
        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div
          className={`collapse navbar-collapse ${
            isCollapsed ? "px-3" : "px-3 show"
          }`}
          id="navbarSupportedContent"
        >
          {/* Left-Aligned Navigation Links */}
          <ul className="navbar-nav me-auto fs-5">
            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
          </ul>

          {/* Right-Aligned Buttons and Form */}
          <div className="d-flex align-items-center">
            {/* Conditional Buttons */}
            {!isLoggedIn ? (
              <>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button
                  className="btn btn-outline-secondary me-3"
                  onClick={handleLogin}
                >
                  SignUp
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-outline-danger me-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            {/* Search Form */}
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
