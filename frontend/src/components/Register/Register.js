import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css"; // Ensure your CSS includes styles for `.register-container`, `.input-field`, `.btn`, etc.

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // Default role is empty
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      alert("All fields are required.");
      return false;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return false;
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      alert("Password must contain both letters and numbers.");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }
    if (!role) {
      alert("Please select a role.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, first_name: firstName, last_name: lastName, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Redirecting to login.");
        navigate("/login");
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="left-panel">
        <h2 className="register-title">Register</h2>

        <div className="input-wrapper">
          <label className="input-label" htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            className="input-field"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label" htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            className="input-field"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="input-field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="input-field"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label" htmlFor="role">Role</label>
          <select id="role" className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="" disabled>Select Role</option>
            <option value="client">Client</option>
            <option value="staff">Company Staff</option>
          </select>
        </div>

        <button className="btn register-btn" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <button className="btn back-btn" onClick={() => navigate("/login")}>Back to Login</button>
      </div>
      <div className="right-panel">
        <p className="register-message">REGISTER AN ACCOUNT</p>
      </div>
    </div>
  );
}

export default Register;