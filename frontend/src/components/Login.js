import React from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form>
                <label>
                    Email:
                    <input type="email" name="email" required />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" required />
                </label>
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Sign Up here</Link>
            </p>
        </div>
    );
};

export default Login;
