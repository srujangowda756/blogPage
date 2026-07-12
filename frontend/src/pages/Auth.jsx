import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser, isAuthenticated } from '../api';
import './BlogForm.css';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password);
        await loginUser(email, password);
      }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page fade-up">
      <div className="container form-container">
        <div className="form-header">
          <h1 className="form-title">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="form-subtitle">
            {isLogin ? 'Sign in to publish and manage your posts.' : 'Register to start blogging.'}
          </p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form className="blog-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="field-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="field-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Please wait…' : isLogin ? 'Login' : 'Register'}
            </button>
          </div>
        </form>

        <p className="field-hint" style={{ textAlign: 'center', marginTop: '1rem' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="btn-ghost" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>

        <Link to="/" className="back-link">← Back home</Link>
      </div>
    </div>
  );
}
