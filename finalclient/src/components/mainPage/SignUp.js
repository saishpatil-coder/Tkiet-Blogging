import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const SignUp = () => {
  let navigate = useNavigate("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nickname: "",
    gender: "",
  });
  const { setAuthState } = useAuth();

  const [responseMessage, setResponseMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required.";
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email format is invalid.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }
    if (!formData.nickname) errors.nickname = "Nickname is required.";
    if (!formData.gender) errors.gender = "Gender is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      try {
        const response = await fetch(
          "http://localhost:3003/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
          }
        );

        const result = await response.json();
        if (response.ok) {
          setAuthState({
            isLoggedIn: true,
            user: result.username, // Assuming the login API returns the username
          });
          setResponseMessage("Registration successful!");
          setFormData({
            username: "",
            email: "",
            password: "",
            nickname: "",
            gender: "",
          });
          navigate("/");
        } else {
          setResponseMessage(result.message || "Registration failed.");
        }
      } catch (error) {
        setResponseMessage("An error occurred. Please try again.");
        console.error("Error:", error);
      }

      console.log("Form Data Submitted:", formData);
      setFormData({
        username: "",
        email: "",
        password: "",
        nickname: "",
        gender: "",
      });
      setFormErrors({});
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="col-6 col-md-5 col-sm-10 p-5 rounded shadow"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <h2 className="text-center mb-4">Register</h2>
        {responseMessage && <p>{responseMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className={`form-control ${
                formErrors.username ? "is-invalid" : ""
              }`}
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {formErrors.username && (
              <div className="invalid-feedback">{formErrors.username}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <div className="invalid-feedback">{formErrors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className={`form-control ${
                formErrors.password ? "is-invalid" : ""
              }`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <div className="invalid-feedback">{formErrors.password}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="nickname" className="form-label">
              Nickname
            </label>
            <input
              type="text"
              className={`form-control ${
                formErrors.nickname ? "is-invalid" : ""
              }`}
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
            />
            {formErrors.nickname && (
              <div className="invalid-feedback">{formErrors.nickname}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              className={`form-control ${
                formErrors.gender ? "is-invalid" : ""
              }`}
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formErrors.gender && (
              <div className="invalid-feedback">{formErrors.gender}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
