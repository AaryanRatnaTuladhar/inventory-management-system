import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <h1 style={styles.logo}>Inventory</h1>
      </div>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <Link to="/dashboard" style={styles.link}>
            <span style={styles.icon}>🏠</span>
            <span style={styles.text}>Dashboard</span>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link to="/products" style={styles.link}>
            <span style={styles.icon}>📦</span>
            <span style={styles.text}>Products</span>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link to="/inventory" style={styles.link}>
            <span style={styles.icon}>📊</span>
            <span style={styles.text}>Inventory</span>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link to="/profile" style={styles.link}>
            <span style={styles.icon}>👤</span>
            <span style={styles.text}>Profile</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    padding: '20px',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    color: '#fff',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    listStyle: 'none',
    padding: '0',
  },
  listItem: {
    marginBottom: '15px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  icon: {
    fontSize: '20px',
    marginRight: '10px',
  },
  text: {
    fontSize: '16px',
  },
};

// Add hover effect using inline styles
styles.linkHover = {
  ...styles.link,
  backgroundColor: '#34495e',
};

export default Sidebar;