import React, { useState } from 'react';
import { FaDiscord } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa";
import '../styles/AITrackerWaitlist.css';
import Alert from './Alert';
import axios from 'axios';


const AITrackerWaitlist = () => {
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';

  const [formData, setFormData] = useState({
    email: '',
  });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/waitlist`, formData);

      if (response.status === 201) {
        setStatus('success');
        setFormData({ email: ''});
      } else {
        setStatus('error');
      }
    } catch (error) {
      if (error.response?.data?.message === 'This email is already on the waitlist') {
        setStatus('duplicate');
      } else {
        setStatus('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="waitlist-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          AI Powered Crypto Trading Alerts
        </h1>
        <p className="hero-subtitle">
          Get In Before the Public!
        </p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <h3 className="feature-title">🔍 Smart Money Tracking</h3>
          <p className="feature-description">Track whale movements and smart money flows in real-time</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">🤖 AI-Powered Analysis</h3>
          <p className="feature-description">Get insights from our advanced AI algorithms</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">⚡ Instant Alerts</h3>
          <p className="feature-description">Receive notifications for new opportunities instantly</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">💎 Early Access Pricing</h3>
          <p className="feature-description">Free for Early Adopters</p>
        </div>
      </div>

      {/* Waitlist Form */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className="waitlist-form">
          <div className="form-group">
            <label className="form-label">
              Email Address *
            </label>
            <div className="input-container">
              <CiMail className="input-icon" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${isLoading ? 'disabled' : ''}`}
          >
            {isLoading ? 'Securing Your Spot...' : '🔒 Secure My Spot Now'}
          </button>
        </form>

        {status === 'success' && (
          <Alert variant="success">
            Thanks for joining! We'll be in touch soon with exclusive access.
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="error">
            Oops! Something went wrong. Please try again.
          </Alert>
        )}

        {status === 'duplicate' && (
                  <Alert variant="warning">
                    This email is already on the waitlist..
                  </Alert>
                )}
      </div>

      {/* Social Links */}
      <div className="social-links">
        <a href="https://discord.gg/QArDnWtSSA" target="_blank" rel="noopener noreferrer"
           className="social-link">
          <FaDiscord />
        </a>
        <a href="https://x.com/CryptosionDEX" target="_blank" rel="noopener noreferrer"
           className="social-link">
          <FaTwitter />
        </a>
      </div>
    </div>
  );
};

export default AITrackerWaitlist;