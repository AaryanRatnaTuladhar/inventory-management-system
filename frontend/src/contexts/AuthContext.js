import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  // API URL - should match your backend
  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    // Check if user is logged in (token exists in localStorage)
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Validate token and set user
        const decoded = jwtDecode(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setCurrentUser(null);
          setIsAdmin(false);
        } else {
          // Get user info from localStorage if it exists
          const userInfoString = localStorage.getItem('userInfo');
          if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            setCurrentUser(userInfo);
            setIsAdmin(userInfo.isAdmin || false);
          } else {
            // Fallback to just token data
            setCurrentUser(decoded);
            setIsAdmin(decoded.isAdmin || false);
          }
          
          // Set default auth header for axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setCurrentUser(null);
        setIsAdmin(false);
      }
    }
    
    setLoading(false);
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      // Check if response contains an error message
      if (response.data.error) {
        setLoading(false);
        setError(response.data.error);
        return { success: false, error: response.data.error };
      }
      
      // Check if the response has the token
      if (!response.data.accessToken) {
        setLoading(false);
        setError(response.data.message || 'Login failed. No token received.');
        return { success: false, error: response.data.message || 'Login failed. No token received.' };
      }

      // Extract data from successful response
      const token = response.data.accessToken;
      const userInfo = {
        id: response.data.ID,
        email: response.data.email,
        userName: response.data.userName || response.data.email.split('@')[0],
        isAdmin: response.data.isAdmin || false, // Store isAdmin status from response
      };
      
      // Save token and user info to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // Set user in state
      setCurrentUser(userInfo);
      setIsAdmin(userInfo.isAdmin); // Set isAdmin state based on response
      
      // Set default auth header for axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setLoading(false);
      return { success: true, message: response.data.message || 'Login successful' };
    } catch (error) {
      setLoading(false);
      // Handle network errors or server errors with status codes
      if (error.response) {
        // Server responded with error status
        const errorMsg = error.response.data.error || error.response.data.message || 'Login failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } else if (error.request) {
        // Request was made but no response received
        setError('No response from server. Check your connection.');
        return { success: false, error: 'No response from server. Check your connection.' };
      } else {
        // Something else caused the error
        setError('Failed to login: ' + error.message);
        return { success: false, error: 'Failed to login: ' + error.message };
      }
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      setError('');
      setLoading(true);
      const response = await axios.post(`${API_URL}/register`, {
        userName: name,
        email,
        password
      });
      setLoading(false);
      
      // Check if the response contains an error
      if (response.data.error) {
        setError(response.data.error);
        return { success: false, error: response.data.error };
      }
      
      // Success case
      return { success: true, message: response.data.message || 'User created successfully' };
    } catch (error) {
      setLoading(false);
      // Handle network errors or server errors with status codes
      if (error.response) {
        // Server responded with error status
        const errorMsg = error.response.data.error || error.response.data.message || 'Registration failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } else if (error.request) {
        // Request was made but no response received
        setError('No response from server. Check your connection.');
        return { success: false, error: 'No response from server. Check your connection.' };
      } else {
        // Something else caused the error
        setError('Failed to register: ' + error.message);
        return { success: false, error: 'Failed to register: ' + error.message };
      }
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setCurrentUser(null);
    setIsAdmin(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  const value = {
    currentUser,
    loading,
    isAdmin,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 