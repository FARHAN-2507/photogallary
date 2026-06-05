import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoaderProvider } from './context/LoaderContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Loader from './components/Loader';

const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Photos = React.lazy(() => import('./pages/Photos'));
const Upload = React.lazy(() => import('./pages/Upload'));

const PageFallback = () => (
  <div className="global-loader-overlay">
    <div className="global-loader">
      <div className="global-spinner" />
      <p>Loading page...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <LoaderProvider>
        <Router>
          <Navbar />
          <Loader />
          <Suspense fallback={<PageFallback />}>
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/photos"
                  element={
                    <ProtectedRoute>
                      <Photos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
      </Router>
    </LoaderProvider>
    </AuthProvider>
  );
};

export default App;
