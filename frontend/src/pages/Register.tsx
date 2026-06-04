import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AxiosError } from 'axios';
import './Auth.css';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminKey: string;
}

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({ name: '', email: '', password: '', confirmPassword: '', adminKey: '' });
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validateForm = (): string | null => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return 'All fields are required.';
    }
    if (form.name.trim().length < 2) {
      return 'Name must be at least 2 characters.';
    }
    if (form.password.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    if (!/[A-Z]/.test(form.password)) {
      return 'Password must contain an uppercase letter.';
    }
    if (!/[a-z]/.test(form.password)) {
      return 'Password must contain a lowercase letter.';
    }
    if (!/[0-9]/.test(form.password)) {
      return 'Password must contain a number.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.adminKey || undefined);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || (err as Error).message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join PhotoGallery today</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          <div className="form-toggle">
            <button type="button" className="toggle-link" onClick={() => setShowAdminKey(prev => !prev)}>
              {showAdminKey ? '−' : '+'} Admin registration?
            </button>
          </div>

          {showAdminKey && (
            <div className="form-group">
              <label htmlFor="adminKey">Admin Key</label>
              <input
                id="adminKey"
                name="adminKey"
                type="password"
                value={form.adminKey}
                onChange={handleChange}
                placeholder="Enter admin secret key"
                disabled={loading}
              />
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
