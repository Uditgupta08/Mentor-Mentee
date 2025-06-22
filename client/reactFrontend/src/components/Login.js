import React, { useState } from 'react';

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className={`form-container ${isLogin ? 'login-mode' : 'signup-mode'} ${isTransitioning ? 'transitioning' : ''}`}>
          {isLogin ? <LoginPage onToggle={toggleMode} /> : <Signup onToggle={toggleMode} />}
        </div>
      </div>
    </div>
  );
}

const LoginPage = ({ onToggle }) => {
  const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/loginUser', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success - redirect to dashboard or success page
        setTimeout(() => {
          window.location.href = '/success';
        }, 100);
      } else {
        // Handle error response
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="content-section">
        <div className="content-wrapper">
          <div className="logo-icon"><div className="logo-icon-text">C2R</div></div>
          <p className="description-text">C2R Mentor Connect is a mentorship platform by Connect2Roots that helps students from underserved communities get guidance and support from experienced professionals.</p>
        </div>
      </div>

      <div className="form-section">
        <div className="form-wrapper">
          <h2 className="form-title">Welcome back</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-container">
            <div className="input-group">
              <label htmlFor="username" className="input-label">Username *</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
                placeholder="Enter your username" 
                className="input-field" 
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password *</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder="Enter your password" 
                className="input-field" 
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  name="rememberMe" 
                  checked={formData.rememberMe} 
                  onChange={handleInputChange} 
                  className="checkbox" 
                  disabled={isLoading} 
                />
                <span className="checkbox-label">Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-password">Forgot password?</a>
            </div>
            <button 
              type="button"
              onClick={handleSubmit} 
              className="sign-in-button" 
              disabled={isLoading} 
              style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </div>
          <div className="auth-switch">
            <p className="auth-switch-text">Don't have an account? <button className="auth-switch-link" onClick={onToggle} disabled={isLoading}>Sign up</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Signup = ({ onToggle }) => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    username: '', 
    password: '', 
    confirmPassword: '', 
    acceptTerms: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return setError('Full name is required'), false;
    if (!formData.email.trim()) return setError('Email is required'), false;
    if (!/\S+@\S+\.\S+/.test(formData.email)) return setError('Please enter a valid email address'), false;
    if (!formData.username.trim()) return setError('Username is required'), false;
    if (formData.password.length < 6) return setError('Password must be at least 6 characters long'), false;
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match'), false;
    if (!formData.acceptTerms) return setError('You must accept the terms and conditions'), false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          fullname: formData.fullName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success - show message and switch to login
        alert(data.message || 'Registration successful! Please log in.');
        onToggle(); // Switch to login form
      } else {
        // Handle error response
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="content-section">
        <div className="content-wrapper">
          <div className="logo-icon"><div className="logo-icon-text">C2R</div></div>
          <p className="description-text">Join C2R Mentor Connect and connect with experienced mentors who can guide you on your professional journey and help you achieve your career goals.</p>
        </div>
      </div>

      <div className="form-section">
        <div className="form-wrapper">
          <h2 className="form-title">Create your account</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-container">
            <div className="input-group">
              <label htmlFor="fullName" className="input-label">Full Name *</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange} 
                placeholder="Enter your full name" 
                className="input-field" 
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="email" className="input-label">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="Enter your email" 
                className="input-field" 
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="username" className="input-label">Username *</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
                placeholder="Choose a username" 
                className="input-field" 
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password *</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder="Create a password" 
                className="input-field" 
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">Confirm Password *</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                placeholder="Confirm your password" 
                className="input-field" 
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  name="acceptTerms" 
                  checked={formData.acceptTerms} 
                  onChange={handleInputChange} 
                  className="checkbox" 
                  disabled={isLoading} 
                />
                <span className="checkbox-label">I accept the <a href="/terms" className="terms-link">Terms and Conditions</a></span>
              </label>
            </div>
            <button 
              type="button"
              onClick={handleSubmit}
              className="sign-in-button" 
              disabled={isLoading} 
              style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </div>
          <div className="auth-switch">
            <p className="auth-switch-text">Already have an account? <button className="auth-switch-link" onClick={onToggle} disabled={isLoading}>Sign in</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};