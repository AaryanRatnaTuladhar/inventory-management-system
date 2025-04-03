import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    return(
     <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">IMS</h1>
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/login">Logout</Link></li>
        </ul>
      </div>
    </nav>
    );
};

export default Navbar;