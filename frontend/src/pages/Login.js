import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
    
      const [error, setError] = useState("");
      const navigate = useNavigate();
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          console.log("FormData being sent:", formData);
          
          const result = await response.json();
          console.log("result", result);
    
          if (response.ok) {
            // Login successful
            // setError("");
            // localStorage.setItem("user", JSON.stringify(result.user)); // Save user data to localStorage

            // ✅ Save token in localStorage
            localStorage.setItem("token", result.token); 
            
            navigate("/dashboard"); // Navigate to the dashboard
          } else {
            // Show error message from the server
            setError(result.message || "Login failed. Please try again.");
          }
        } catch (err) {
          setError("An error occurred. Please try again later.");
        }
      };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                <h3>Email:</h3>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                </label>
                <label>
                <h3>Password:</h3>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                </label>
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
        </div>
    );
};

export default Login;
