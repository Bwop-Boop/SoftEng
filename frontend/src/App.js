import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import "./App.css"; // Ensure this import is correct

// Import components
import StoreForm from "./components/StoForm/StoreForm";
import StoreManagement from "./components/StorMan/StoreManagement";
import EvaluationForm from "./components/EvalForm/EvaluationForm";
import EvaluationList from "./components/EvalList/EvaluationList";
import ReportDashboard from "./components/RepDash/ReportDashboard";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Loading from "./components/Loading/Loading"; // Import the Loading component

const LoadingWrapper = ({ children, setLoading }) => {
  const location = useLocation();

  useEffect(() => {
    console.log("Location changed:", location.pathname);
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      console.log("Loading finished");
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);

  return children;
};

function App() {
  const [activeTab, setActiveTab] = useState("store");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const role = sessionStorage.getItem("userRole");
    const storedUsername = sessionStorage.getItem("username");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUsername(storedUsername || "User"); // ✅ Default if username is missing
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <header className="header">
            <h1 className="header-title">
              <span className="text-sync">Sync</span>
              <span className="text-mode">Mode</span>
              <span className="text-on">On</span>
            </h1>
            <nav className="nav-tabs">
              {userRole === "staff" && (
                <>
                  <Link to="/store-form" className={activeTab === "store" ? "active" : ""} onClick={() => setActiveTab("store")}>Add Store</Link>
                  <Link to="/manage-stores" className={activeTab === "manage-stores" ? "active" : ""} onClick={() => setActiveTab("manage-stores")}>Manage Stores</Link>
                  <Link to="/evaluation" className={activeTab === "evaluation" ? "active" : ""} onClick={() => setActiveTab("evaluation")}>Submit Evaluation</Link>
                </>
              )}
              <Link to="/evaluation-list" className={activeTab === "list" ? "active" : ""} onClick={() => setActiveTab("list")}>Evaluation Summaries</Link>
              <Link to="/report-dashboard" className={activeTab === "report" ? "active" : ""} onClick={() => setActiveTab("report")}>Store Reports</Link>
              <div className="profile-dropdown">
                <p style={{ textAlign: "center" }}> Hello! </p>
                <p> {username} </p>
                <div className="dropdown-content">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </nav>
          </header>
        )}

        {loading && <Loading />}
        <LoadingWrapper setLoading={setLoading}>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to={userRole === "staff" ? "/store-form" : "/report-dashboard"} /> : <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
            <Route path="/store-form" element={isAuthenticated && userRole === "staff" ? <StoreForm setLoading={setLoading} /> : <Navigate to="/login" />} />
            <Route path="/evaluation" element={isAuthenticated && userRole === "staff" ? <EvaluationForm setLoading={setLoading} /> : <Navigate to="/login" />} />
            <Route path="/evaluation-list" element={isAuthenticated ? <EvaluationList setLoading={setLoading} userRole={userRole} /> : <Navigate to="/login" />} />
            <Route path="/report-dashboard" element={isAuthenticated ? <ReportDashboard setLoading={setLoading} /> : <Navigate to="/login" />} />
            <Route path="/manage-stores" element={isAuthenticated && userRole === "staff" ? <StoreManagement setLoading={setLoading} /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </LoadingWrapper>
      </div>
    </Router>
  );
}

export default App;