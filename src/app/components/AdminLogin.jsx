'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminLogin({ onLoginSuccess }) {
  const [step, setStep] = useState('login'); // 'login' or 'otp'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMsg, setToasterMsg] = useState('');
  const [toasterType, setToasterType] = useState('success');

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg, type) => {
    setToasterMsg(msg);
    setToasterType(type);
    setShowToaster(true);
    setTimeout(() => setShowToaster(false), 2000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          action: 'login'
        })
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug log

      if (data.success) {
        setStep('otp');
        showToast('OTP sent to your email!', 'success');
      } else {
        setError(data.error || 'Login failed');
        showToast(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      setError('Network error. Please try again.');
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          action: 'verify-otp'
        })
      });

      const data = await response.json();
      console.log('OTP response:', data); // Debug log

      if (data.success) {
        showToast('Login successful!', 'success');
        setTimeout(() => {
          onLoginSuccess(data.token, data.admin);
        }, 1200);
      } else {
        setError(data.error || 'OTP verification failed');
        showToast(data.error || 'Invalid OTP', 'error');
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        if (data.attemptsLeft === 0) {
          setStep('login');
          setFormData({ email: '', password: '', otp: '' });
        }
      }
    } catch (error) {
      console.error('OTP error:', error); // Debug log
      setError('Network error. Please try again.');
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep('login');
    setFormData({ ...formData, otp: '' });
    setError('');
    setAttemptsLeft(3);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      {/* macOS-inspired Background with Dynamic Wallpaper */}
      <div className="macos-login-container">
        {/* Dynamic Background Particles */}
        <div className="background-particles">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>



        {/* Liquid Glass Toaster */}
        {showToaster && (
          <div className={`macos-toaster ${toasterType === "success" ? "success" : "error"}`}>
            <div className="toaster-icon">
              {toasterType === "success" ? "✓" : "⚠"}
            </div>
            <span className="toaster-message">{toasterMsg}</span>
          </div>
        )}

        {/* Main Login Content */}
        <div className="login-content">
          {step === 'login' ? (
            <div className="liquid-glass-form login-form">
              {/* Logo Section */}
              <div className="login-header">
                <div className="login-logo">
                  <Image
                    src="/images/CSR-logo.svg"
                    alt="CS Rippers"
                    width={60}
                    height={60}
                    className="logo-main"
                  />
                </div>
                <h1 className="login-title glass-text-bright">Admin Access</h1>
                <p className="login-subtitle glass-text-muted">Sign in to your admin account</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="login-form-content">
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Admin Email Address"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="liquid-glass-input"
                  />
                  {error && (
                    <div className="status-message error">
                      <span className="status-icon">⚠</span>
                      {error}
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Admin Password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="liquid-glass-input password-input"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      <span className="toggle-icon">
                        {showPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="liquid-glass-btn login-button"
                >
                  <span className="button-content">
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Signing in...
                      </>
                    ) : (
                      "Access Admin Panel"
                    )}
                  </span>
                </button>
              </form>
            </div>
          ) : (
            <div className="liquid-glass-form otp-form">
              {/* OTP Header */}
              <div className="otp-header">
                <div className="otp-icon">
                  <div className="security-badge">
                    <Image
                      src="/images/CSR-logo.svg"
                      alt="CS Rippers"
                      width={40}
                      height={40}
                      className="logo-main"
                    />
                  </div>
                </div>
                <h1 className="otp-title glass-text-bright">Admin Verification</h1>
                <p className="otp-subtitle glass-text-muted">
                  We've sent a verification code to your admin email
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="status-message error" style={{ marginBottom: '1.5rem' }}>
                  <span className="status-icon">⚠</span>
                  <div>
                    {error}
                    {attemptsLeft > 0 && (
                      <div style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.8 }}>
                        Attempts remaining: {attemptsLeft}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* OTP Form */}
              <form onSubmit={handleOtpVerification} className="otp-form-content">
                <div className="input-group">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit code"
                    required
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="liquid-glass-input otp-input"
                    maxLength={6}
                  />
                </div>

                <div className="otp-buttons">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="liquid-glass-btn back-button"
                  >
                    <span className="button-content">Back to Login</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="liquid-glass-btn verify-button"
                  >
                    <span className="button-content">
                      {loading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Verifying...
                        </>
                      ) : (
                        "Verify & Access"
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        /* macOS Login Container */
        .macos-login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, 
            #000000 0%, 
            #1a1a1a 25%, 
            #2d2d2d 50%, 
            #1a1a1a 75%, 
            #000000 100%);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Background Particles */
        .background-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float linear infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* macOS Menu Bar */
        .macos-menubar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 28px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 1000;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
        }

        .menubar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cs-logo {
          display: flex;
          align-items: center;
        }

        .logo-image {
          filter: brightness(1.2);
        }

        .menu-item {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .menu-item:hover {
          color: white;
        }

        .menubar-right {
          display: flex;
          align-items: center;
        }

        .system-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .system-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .system-icon:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .time {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }

        .glass-text {
          color: rgba(255, 255, 255, 0.9);
        }

        /* Toaster */
        .macos-toaster {
          position: fixed;
          top: 60px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 1001;
          animation: slideInRight 0.3s ease-out;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
        }

        .macos-toaster.success {
          border-color: rgba(74, 222, 128, 0.3);
        }

        .macos-toaster.error {
          border-color: rgba(248, 113, 113, 0.3);
        }

        .toaster-icon {
          font-size: 16px;
        }

        .macos-toaster.success .toaster-icon {
          color: #4ade80;
        }

        .macos-toaster.error .toaster-icon {
          color: #f87171;
        }

        .toaster-message {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Login Content */
        .login-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
        }

        /* Login Form Styles */
        .login-form, .otp-form {
          padding: 3rem 2.5rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;
          position: relative;
          overflow: hidden;
          animation: slideInUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .login-form::before, .otp-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.3), 
            transparent);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        /* Login Header */
        .login-header, .otp-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-logo, .otp-icon {
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .logo-main {
          filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.2));
          animation: logoGlow 3s ease-in-out infinite alternate;
        }

        @keyframes logoGlow {
          0% { filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.2)); }
          100% { filter: drop-shadow(0 6px 20px rgba(255, 255, 255, 0.4)); }
        }

        .login-title, .otp-title {
          font-size: 2rem;
          font-weight: 300;
          margin-bottom: 0.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          letter-spacing: -0.02em;
        }

        .login-subtitle, .otp-subtitle {
          font-size: 0.95rem;
          font-weight: 400;
          opacity: 0.8;
        }

        .glass-text-bright {
          color: rgba(255, 255, 255, 0.95);
        }

        .glass-text-muted {
          color: rgba(255, 255, 255, 0.7);
        }

        .security-badge {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        /* Form Content */
        .login-form-content, .otp-form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          position: relative;
        }

        .liquid-glass-input {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 0;
        }

        .liquid-glass-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 0 0 3px rgba(255, 255, 255, 0.1),
            0 8px 24px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }

        .liquid-glass-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
        }

        .otp-input {
          text-align: center;
          font-size: 24px;
          letter-spacing: 0.5em;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        }

        /* Password Input */
        .password-input-container {
          position: relative;
        }

        .password-input {
          padding-right: 50px;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .toggle-icon {
          opacity: 0.7;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
        }

        .toggle-icon svg {
          transition: all 0.2s;
        }

        .password-toggle:hover .toggle-icon {
          opacity: 1;
          color: rgba(255, 255, 255, 1);
          transform: scale(1.1);
        }

        /* Status Messages */
        .status-message {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.85rem;
          margin-top: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .status-message.success {
          color: #4ade80;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.2);
        }

        .status-message.error {
          color: #f87171;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.2);
        }

        .status-icon {
          font-size: 14px;
          margin-top: 1px;
        }

        /* Buttons */
        .liquid-glass-btn {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .liquid-glass-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.2), 
            transparent);
          transition: left 0.5s;
        }

        .liquid-glass-btn:hover::before {
          left: 100%;
        }

        .liquid-glass-btn:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.08) 100%);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        .liquid-glass-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        /* OTP Buttons */
        .otp-buttons {
          display: flex;
          gap: 12px;
          margin-top: 1rem;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Loading Spinner */
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .macos-login-container {
            padding: 1rem;
          }
          
          .login-form, .otp-form {
            padding: 2rem 1.5rem;
          }
          
          .login-content {
            max-width: 100%;
          }
          
          .otp-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}