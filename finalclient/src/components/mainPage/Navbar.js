import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        setIsLoggedIn(false); // Update state to reflect logout
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3003/api/auth/isloggedin",
          {
            method: "GET",
            credentials: "include", // Include cookies with the request
          }
        );

        const data = await response.json();
        console.log(data);
        if (data.isLoggedIn) {
          console.log("success login req");
          setIsLoggedIn(true); // Update login state based on server response
        } else {
          console.log("not success");
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error during login status check:", err);
        setIsLoggedIn(false); // If request fails, assume not logged in
      }
    };

    checkLoginStatus(); // Check login status when component mounts
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
              <button
                className="btn btn-outline-danger me-3"
                onClick={handleLogout}
              >
                Logout
              </button>
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
