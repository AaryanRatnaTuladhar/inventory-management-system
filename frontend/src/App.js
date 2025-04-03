import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import Products from "./pages/Products";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Navigate } from "react-router-dom";
const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route element={<ProtectedRoute/>}/>
            <Route element={<Layout/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route> 
            

          <Route path="*" element={<Navigate to='/login' />} />
        </Routes>
      </Router>
    );
};

export default App;
