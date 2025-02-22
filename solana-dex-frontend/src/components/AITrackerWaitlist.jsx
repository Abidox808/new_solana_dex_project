import React, { useState } from 'react';
import { FaDiscord } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { IoSend } from "react-icons/io5";
import { FaTwitter } from "react-icons/fa";
import '../styles/AITrackerWaitlist.css';
import Alert from './Alert';

const AITrackerWaitlist = () => {
  const [formData, setFormData] = useState({
    email: '',
    discord: '',
    telegram: ''
  });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Log the raw response
      const responseText = await response.text();
      console.log('Raw response:', responseText);
  
      // Try to parse JSON only if there's content
      let data;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('JSON parse error:', e);
        }
      }
  
      if (response.ok) {
        setStatus('success');
        setFormData({ email: '', discord: '', telegram: '' });
      } else {
        setStatus('error');
        console.error('Error response:', data || responseText);
      }
    } catch (error) {
      setStatus('error');
      console.error('Submission error:', error);
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
          <p className="feature-description">$30/month for early adopters (Regular $50/month)</p>
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

          <div className="form-group">
            <label className="form-label">
              Discord Handle (Optional)
            </label>
            <div className="input-container">
              <FaDiscord className="input-icon" />
              <input
                type="text"
                name="discord"
                value={formData.discord}
                onChange={handleChange}
                className="form-input"
                placeholder="Your Discord username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Telegram Username (Optional)
            </label>
            <div className="input-container">
              <IoSend className="input-icon" />
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                className="form-input"
                placeholder="Your Telegram username"
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
      </div>

      {/* Social Links */}
      <div className="social-links">
        <a href="https://discord.gg/yourdiscord" target="_blank" rel="noopener noreferrer"
           className="social-link">
          <FaDiscord />
        </a>
        <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer"
           className="social-link">
          <FaTwitter />
        </a>
      </div>
    </div>
  );
};

export default AITrackerWaitlist;