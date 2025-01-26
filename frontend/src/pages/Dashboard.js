import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "../styles/Dashboard.css"; // Optional: Add styles for the dashboard

const Dashboard = () => {
    const navigate = useNavigate();

    // const handleLogout = () => {
    //     // Clear any stored user data (e.g., from localStorage or state)
    //     localStorage.removeItem("user");
    //     navigate("/login"); // Redirect to the login page
    // };

    return (
        <div className="dashboard-container">
            <h1>Welcome, to the dashboard!</h1>
            <p>You have successfully logged in or signed up.</p>
            {/* <button onClick={handleLogout}>Logout</button> */}
        </div>
    );
};

export default Dashboard;
