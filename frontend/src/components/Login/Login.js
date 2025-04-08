import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Ensure your CSS file includes styles for `.login-container`, `.input-field`, `.btn`, etc.

function Login({ setIsAuthenticated, setUserRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (username.trim() === "" || password.trim() === "") {
      setError("Username and password cannot be empty.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("userRole", data.role);
        sessionStorage.setItem("username", username);

        setIsAuthenticated(true);
        setUserRole(data.role);
        navigate(data.role === "staff" ? "/store-form" : "/report-dashboard");
        window.location.reload();
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>SyncModeOn</h1>
        <p>Welcome to our Mystery Shopping Evaluation System!</p>
      </div>
      <div className="right-panel">
        <h2>SIGN IN</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="btn login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>Don't have an account?</p>
        <button className="btn register-btn" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;