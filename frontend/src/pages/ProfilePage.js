import React from 'react';

const ProfilePage = () => {
  return (
    <div style={styles.container}>
      <h1>Profile Page</h1>
      <p>Welcome to your profile!</p>
    </div>
  );
};

// const handleLogout = () => {
//   localStorage.removeItem("token"); // Remove token
//   window.location.href = "/login"; // Redirect to login
// };

const styles = {
  container: {
    padding: '20px',
  },
};

export default ProfilePage;