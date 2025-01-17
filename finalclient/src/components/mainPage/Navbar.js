import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { authState, setAuthState, checkLoggedIn } = useAuth();
  const { isLoggedIn, user } = authState;
  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3003/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies with the request
      });

      if (response.ok) {
        setAuthState({
          isLoggedIn: false,
          user: null,
        }); // Update state to reflect logout
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  useEffect(() => {
    checkLoggedIn();
    // Check login status when component mounts
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
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
            {isLoggedIn ? (
              <>
                <a className="navbar-brand fs-5" href="#">
                  {user}
                </a>
                <button
                  className="btn btn-outline-danger me-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn btn-outline-primary me-2">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="btn btn-outline-secondary me-3">
                    SignUp
                  </button>
                </Link>
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
