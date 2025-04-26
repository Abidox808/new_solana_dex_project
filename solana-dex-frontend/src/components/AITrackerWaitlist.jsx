
import React, { useState } from 'react';
import { FaDiscord } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa";
import { FaWallet, FaChartLine } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
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
    <div className="cosmic-container">
      {/* Hero Section */}
      <div className="cosmic-hero">
        <h1 className="cosmic-title">
          MASTER AI TRADING<br />BEFORE EVERYONE ELSE
        </h1>
        <p className="cosmic-subtitle">
          Join the waitlist for all-in-one AI trading
        </p>
      </div>

      {/* Features Grid */}
      <div className="cosmic-features-grid">
        <div className="cosmic-feature-card">
          <div className="feature-icon">
            <FaWallet />
          </div>
          <h3 className="cosmic-feature-title">Wallet Tracking</h3>
          <p className="cosmic-feature-description">
            Track public wallets, smart trades & detect emerging trends in real-time.
          </p>
        </div>
        
        <div className="cosmic-feature-card">
          <div className="feature-icon">
            <FaTwitter />
          </div>
          <h3 className="cosmic-feature-title">AI Twitter Sync</h3>
          <p className="cosmic-feature-description">
          Utilize AI to link Trading wallets, to X accounts (formerly twitter) to find common trends. Find alpha trades without needing to be in Alpha trading groups.
          </p>
        </div>
        
        <div className="cosmic-feature-card">
          <div className="feature-icon">
            <FaChartLine />
          </div>
          <h3 className="cosmic-feature-title">Backtesting & Paper Trading</h3>
          <p className="cosmic-feature-description">
            Build and test your trading strategies with integrated simulators.
          </p>
        </div>
        
        <div className="cosmic-feature-card">
          <div className="feature-icon">
            <MdDashboard />
          </div>
          <h3 className="cosmic-feature-title">Profitable Dashboard</h3>
          <p className="cosmic-feature-description">
            Gain access to a modern interface to create and optimize strategies for max profits.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cosmic-cta">
        <h2 className="cosmic-cta-title">
          LOCK IN YOUR SPOT BEFORE IT'S TOO LATE
        </h2>
        
        {/* Waitlist Form */}
        <div className="cosmic-form-container">
          <form onSubmit={handleSubmit} className="cosmic-form">
            <div className="cosmic-form-group">
              <div className="cosmic-input-container">
                <CiMail className="cosmic-input-icon" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="cosmic-input"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`cosmic-button ${isLoading ? 'disabled' : ''}`}
              >
                {isLoading ? 'SECURING SPOT...' : 'LOCK IN YOUR SPOT'}
              </button>
            </div>
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
              This email is already on the waitlist.
            </Alert>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="cosmic-social-links">
        <a href="https://discord.gg/QArDnWtSSA" target="_blank" rel="noopener noreferrer"
           className="cosmic-social-link">
          <FaDiscord />
        </a>
        <a href="https://x.com/CryptosionDEX" target="_blank" rel="noopener noreferrer"
           className="cosmic-social-link">
          <FaTwitter />
        </a>
      </div>
    </div>
  );
};

export default AITrackerWaitlist;