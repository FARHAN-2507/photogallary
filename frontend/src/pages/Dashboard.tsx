import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1>
          Welcome, {user?.name || 'User'}
          {isAdmin && <span className="admin-badge">Admin</span>}
        </h1>
        <p>{isAdmin ? 'Manage all user photos' : 'Store and manage your photos securely'}</p>
      </div>

      <div className="dashboard-cards">
        {isAdmin ? (
          <Link to="/photos" className="dash-card dash-card-admin">
            <div className="dash-card-icon">🖼️</div>
            <h3>All Photos</h3>
            <p>View all photos uploaded by every user</p>
            <span className="dash-card-action">Browse all →</span>
          </Link>
        ) : (
          <Link to="/photos" className="dash-card">
            <div className="dash-card-icon">🖼️</div>
            <h3>My Photos</h3>
            <p>View and manage your photo gallery</p>
            <span className="dash-card-action">Browse →</span>
          </Link>
        )}

        <Link to="/upload" className="dash-card dash-card-upload">
          <div className="dash-card-icon">📸</div>
          <h3>Upload Photos</h3>
          <p>Add new photos to your gallery</p>
          <span className="dash-card-action">Upload now →</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
