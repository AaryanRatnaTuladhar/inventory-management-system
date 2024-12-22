import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route
                    path="/dashboard"
                    element={
                        <Dashboard
                            user={JSON.parse(localStorage.getItem("user"))} // Retrieve user from localStorage
                        />
                    }
                /> */}
            </Routes>
        </Router>
    );
};

export default App;
