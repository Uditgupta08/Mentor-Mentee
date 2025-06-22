import React, { useState } from 'react';
import '../src/index.css'; // Import the CSS file

export default function CodementorSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Add your social login logic here
  };

  return (
    <div className="signup-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="left-panel-content">
          <div className="logo-container">
            <div className="logo-icon">
              <div className="logo-icon-inner">
                <div className="logo-icon-text">C</div>
              </div>
            </div>
            <div>
              <span className="logo-text">codementor</span>
              <span className="logo-subtitle">BY arc()</span>
            </div>
          </div>
          <p className="description-text">
            Codementor is a mentorship platform related to the Arc brand that helps you get better at coding. You can use the same account to log into both Codementor and Arc.
          </p>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="right-panel">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Create an account</h2>
            <p className="form-subtitle">to continue to Codementor</p>
          </div>

          <div className="form-fields">
            <div className="form-field">
              <label className="form-label">
                Full name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="signup-button"
            >
              SIGN UP
            </button>
          </div>

          <div className="divider">
            <span className="divider-text">OR</span>
          </div>

          {/* Social Login Buttons */}
          <div className="social-buttons">
            <button 
              className="social-button github-button"
              onClick={() => handleSocialLogin('GitHub')}
              title="Sign up with GitHub"
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
            
            <button 
              className="social-button linkedin-button"
              onClick={() => handleSocialLogin('LinkedIn')}
              title="Sign up with LinkedIn"
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            
            <button 
              className="social-button facebook-button"
              onClick={() => handleSocialLogin('Facebook')}
              title="Sign up with Facebook"
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            
            <button 
              className="social-button google-button"
              onClick={() => handleSocialLogin('Google')}
              title="Sign up with Google"
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
          </div>

          <div className="login-link-container">
            <span className="login-link-text">Already have an account? </span>
            <a href="/login" className="login-link">Log in</a>
          </div>

          <div className="terms-container">
            By creating an account, I agree to the{' '}
            <a href="/terms" className="terms-link">Terms of Service</a>,{' '}
            <a href="/privacy" className="terms-link">Privacy Policy</a>, and{' '}
            <a href="/cookies" className="terms-link">Cookie Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}