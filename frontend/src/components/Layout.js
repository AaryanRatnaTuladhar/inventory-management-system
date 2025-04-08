import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.mainContent}>
        <div style={styles.navbarWrapper}>
          <Navbar />
        </div>

        <div style={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  navbarWrapper: {
    position: "sticky",
    top: 0,
    width: "100%",
    zIndex: 1000,
  },
  pageContent: {
    flex: 1,
    padding: "20px",
    marginTop: "10vh", // Adjust this to match your navbar height
    marginLeft: "35vh", // Adjust this to match your navbar height
    overflowY: "auto", // Enables scrolling if content overflows
  },
};

export default Layout;