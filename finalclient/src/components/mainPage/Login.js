import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState("");
  let nevigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginData({ ...loginData, [id]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!loginData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = "Email format is invalid.";
    }
    if (!loginData.password) {
      errors.password = "Password is required.";
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({}); // Clear errors
    setResponseMessage(""); // Clear previous responses

    // Placeholder for API call
    try {
      // Replace with your login API endpoint
      const response = await fetch("http://localhost:3003/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      const result = await response.json();
      if (response.ok) {
        setResponseMessage("Login successful!");
        nevigate("/");
        console.log(result);
      } else {
        setResponseMessage(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-5 p-5">
      <h1 className="text-success text-center">Login To Continue</h1>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body p-4">
                <form
                  id="loginForm"
                  className="d-flex flex-column gap-3"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      className={`form-control ${
                        formErrors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={handleChange}
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      className={`form-control ${
                        formErrors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleChange}
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback">
                        {formErrors.password}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary mt-2"
                    style={{ width: "100%" }}
                  >
                    Login
                  </button>
                </form>
                {responseMessage && (
                  <div
                    className={`mt-3 alert ${
                      responseMessage.includes("successful")
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                  >
                    {responseMessage}
                  </div>
                )}
                <p className="mt-3 text-center">
                  Not registered?{" "}
                  <Link to="/signup" className="text-primary">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
