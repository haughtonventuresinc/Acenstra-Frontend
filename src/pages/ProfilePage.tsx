import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    // This should ideally not happen if the route is protected properly,
    // but as a fallback:
    return <p>Loading user profile or not logged in...</p>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>User Profile</h2>
      <p><strong>ID:</strong> {user.userId}</p>
      <p><strong>Username:</strong> {user.username}</p>
      {/* Display other user information if available */}
      <button onClick={logout} style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
