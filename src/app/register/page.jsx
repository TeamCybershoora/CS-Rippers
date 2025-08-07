"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirectIfAuthenticated, setAuthData, redirectToDashboard } from "../../lib/auth";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function RegisterPage() {
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianMobile, setGuardianMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMsg, setToasterMsg] = useState("");
  const [toasterType, setToasterType] = useState("success");
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated and redirect if needed
    redirectIfAuthenticated();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setPhotoFile(file);
    }
  };

  async function uploadToCloudinary(file) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "cs_ripper/profile-photo");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (data.secure_url) return data.secure_url;
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    let photoUrl = "";
    try {
      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile);
      }
    } catch (err) {
      showToast("Photo upload failed!", "error");
      setLoading(false);
      return;
    }
    const payload = {
      name,
      email,
      mobile,
      role,
      guardianName: role === "student" ? guardianName : undefined,
      guardianMobile: role === "student" ? guardianMobile : undefined,
      password,
      photo: photoUrl,
    };
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setUserId(data.id);
        setShowOtp(true);
        showToast("OTP sent to your email!", "success");
      } else {
        showToast(data.error || "Registration failed", "error");
      }
    } catch (err) {
      showToast("Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthData(data.userId || userId);
        showToast("Registration complete!", "success");
        setTimeout(() => {
          redirectToDashboard();
        }, 1200);
      } else {
        showToast(data.error || "Invalid OTP", "error");
      }
    } catch (err) {
      showToast("Something went wrong!", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  const showToast = (msg, type) => {
    setToasterMsg(msg);
    setToasterType(type);
    setShowToaster(true);
    setTimeout(() => setShowToaster(false), 2000);
  };

  return (
    <>
      {/* macOS-inspired Background with Dynamic Wallpaper */}
      <div className="macos-register-container">
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

        {/* macOS Menu Bar */}
        <div className="macos-menubar">
          <div className="menubar-left">
            <div className="cs-logo">
              <Image
                src="/images/CSR-logo.svg"
                alt="CS Rippers"
                width={20}
                height={20}
                className="logo-image"
              />
            </div>
            <div className="menu-item">CS Rippers</div>
          </div>
          <div className="menubar-right">
            <div className="system-controls">
              <span className="menu-item system-icon" title="Spotlight Search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              <span className="menu-item system-icon" title="Control Center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </span>
              <span className="menu-item system-icon" title="WiFi">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                  <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                  <line x1="12" y1="20" x2="12.01" y2="20"/>
                </svg>
              </span>
              <span className="menu-item system-icon" title="Battery">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/>
                  <line x1="23" y1="13" x2="23" y2="11"/>
                  <rect x="3" y="8" width="12" height="8" rx="1" ry="1" fill="currentColor" opacity="0.7"/>
                </svg>
              </span>
              <span className="menu-item system-icon" title="Bluetooth">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.5 6.5l11 11L12 23l-5.5-5.5L12 12l5.5-5.5L12 1l5.5 5.5-11 11"/>
                </svg>
              </span>
              <span className="menu-item system-icon" title="Sound">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              </span>
              <span className="menu-item time glass-text">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
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

        {/* Main Register Content */}
        <div className="register-content">
          {!showOtp ? (
            <div className="liquid-glass-form register-form">
              {/* Logo Section */}
              <div className="register-header">
                <div className="register-logo">
                  <Image
                    src="/images/CSR-logo.svg"
                    alt="CS Rippers"
                    width={60}
                    height={60}
                    className="logo-main"
                  />
                </div>
                <h1 className="register-title glass-text-bright">Join CS Rippers</h1>
                <p className="register-subtitle glass-text-muted">Create your account to get started</p>
              </div>

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="register-form-content">
                {/* Profile Photo Upload */}
                <div className="photo-upload-section">
                  <label htmlFor="photo-upload" className="photo-upload-label">
                    {photo ? (
                      <img src={photo} alt="Profile" className="profile-photo-preview" />
                    ) : (
                      <div className="photo-placeholder">
                        <span className="photo-icon">📷</span>
                        <span className="photo-text">Add Photo</span>
                      </div>
                    )}
                  </label>
                  <input 
                    id="photo-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoChange} 
                    className="photo-input-hidden" 
                  />
                  {uploading && (
                    <div className="upload-status">
                      <div className="loading-spinner"></div>
                      <span>Uploading photo...</span>
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="liquid-glass-input"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="liquid-glass-input"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="liquid-glass-input"
                  />
                </div>

                <div className="input-group">
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    required
                    className="liquid-glass-input liquid-glass-select"
                  >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                {role === "student" && (
                  <>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Guardian's Name"
                        required
                        value={guardianName}
                        onChange={e => setGuardianName(e.target.value)}
                        className="liquid-glass-input"
                      />
                    </div>

                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Guardian's Mobile Number"
                        required
                        value={guardianMobile}
                        onChange={e => setGuardianMobile(e.target.value)}
                        className="liquid-glass-input"
                      />
                    </div>
                  </>
                )}

                <div className="input-group">
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
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

                <div className="input-group">
                  <div className="password-input-container">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="liquid-glass-input password-input"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="password-toggle"
                    >
                      <span className="toggle-icon">
                        {showConfirm ? (
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
                  disabled={loading || uploading}
                  className="liquid-glass-btn register-button"
                >
                  <span className="button-content">
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Creating Account...
                      </>
                    ) : uploading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Uploading Photo...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </span>
                </button>

                <div className="register-footer">
                  <p className="glass-text-muted">
                    Already have an account?{" "}
                    <Link href="/login" className="login-link">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className="liquid-glass-form otp-form">
              {/* OTP Header */}
              <div className="otp-header">
                <div className="otp-icon">
                  <div className="security-badge">
                    <span>🔐</span>
                  </div>
                </div>
                <h1 className="otp-title glass-text-bright">Verification Required</h1>
                <p className="otp-subtitle glass-text-muted">
                  We've sent a verification code to your email
                </p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleOtpSubmit} className="otp-form-content">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    required
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="liquid-glass-input otp-input"
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="liquid-glass-btn verify-button"
                >
                  <span className="button-content">
                    {otpLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Verifying...
                      </>
                    ) : (
                      "Verify & Continue"
                    )}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        /* macOS Register Container */
        .macos-register-container {
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
          background: linear-gradient(180deg, 
            rgba(30, 30, 30, 0.95) 0%,
            rgba(25, 25, 25, 0.9) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          z-index: 1000;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1) inset, 0 1px 12px rgba(0, 0, 0, 0.4);
        }

        .menubar-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .cs-logo {
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cs-logo:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .logo-image {
          height: 20px;
          width: auto;
          object-fit: contain;
          transition: all 0.2s;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        .menu-item {
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          cursor: pointer;
          padding: 2px 8px;
          border-radius: 4px;
          transition: background 0.15s ease-out;
          letter-spacing: -0.01em;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .menubar-right .time {
          font-size: 13px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          letter-spacing: 0.01em;
          font-variant-numeric: tabular-nums;
        }

        /* Register Content */
        .register-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
        }

        /* Register Form Styles */
        .register-form {
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

        .register-form::before {
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

        /* Register Header */
        .register-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .register-logo {
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

        .register-title {
          font-size: 2rem;
          font-weight: 300;
          margin-bottom: 0.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          letter-spacing: -0.02em;
        }

        .register-subtitle {
          font-size: 0.95rem;
          font-weight: 400;
          opacity: 0.8;
        }

        /* Form Content */
        .register-form-content {
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

        .liquid-glass-select {
          cursor: pointer;
        }

        .liquid-glass-select option {
          background: #1a1a1a;
          color: white;
          padding: 10px;
        }

        /* Photo Upload Section */
        .photo-upload-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .photo-upload-label {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px dashed rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .photo-upload-label:hover {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.08);
          transform: scale(1.05);
        }

        .profile-photo-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .photo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .photo-icon {
          font-size: 2rem;
        }

        .photo-text {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .photo-input-hidden {
          display: none;
        }

        .upload-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
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

        /* Register Button */
        .register-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, 
            rgba(34, 197, 94, 0.2) 0%, 
            rgba(34, 197, 94, 0.1) 100%);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(34, 197, 94, 0.3);
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

        .register-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(34, 197, 94, 0.3), 
            transparent);
          transition: left 0.5s;
        }

        .register-button:hover::before {
          left: 100%;
        }

        .register-button:hover {
          background: linear-gradient(135deg, 
            rgba(34, 197, 94, 0.25) 0%, 
            rgba(34, 197, 94, 0.15) 100%);
          border-color: rgba(34, 197, 94, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(34, 197, 94, 0.2);
        }

        .register-button:disabled {
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

        /* Register Footer */
        .register-footer {
          text-align: center;
          margin-top: 1rem;
        }

        .login-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          position: relative;
        }

        .login-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.9);
          transition: width 0.3s;
        }

        .login-link:hover::after {
          width: 100%;
        }

        .login-link:hover {
          color: white;
        }

        /* OTP Form Styles */
        .otp-form {
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

        .otp-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .otp-icon {
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .security-badge {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
          }
        }

        .otp-title {
          font-size: 1.8rem;
          font-weight: 300;
          margin-bottom: 0.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          letter-spacing: -0.02em;
        }

        .otp-subtitle {
          font-size: 0.95rem;
          font-weight: 400;
          opacity: 0.8;
        }

        .otp-form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .otp-input {
          text-align: center;
          font-size: 1.5rem;
          letter-spacing: 0.5rem;
          font-weight: 500;
        }

        .verify-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, 
            rgba(34, 197, 94, 0.2) 0%, 
            rgba(34, 197, 94, 0.1) 100%);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(34, 197, 94, 0.3);
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

        .verify-button:hover {
          background: linear-gradient(135deg, 
            rgba(34, 197, 94, 0.25) 0%, 
            rgba(34, 197, 94, 0.15) 100%);
          border-color: rgba(34, 197, 94, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(34, 197, 94, 0.2);
        }

        /* macOS Toaster */
        .macos-toaster {
          position: fixed;
          top: 80px;
          right: 24px;
          z-index: 1000;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          animation: slideInRight 0.3s ease-out;
        }

        .macos-toaster.success {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .macos-toaster.error {
          border-color: rgba(248, 113, 113, 0.3);
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .toaster-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        .macos-toaster.success .toaster-icon {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }

        .macos-toaster.error .toaster-icon {
          background: rgba(248, 113, 113, 0.2);
          color: #f87171;
        }

        .toaster-message {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
        }

        /* Glass Text Styles */
        .glass-text {
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .glass-text-muted {
          color: rgba(255, 255, 255, 0.7);
        }

        .glass-text-bright {
          color: rgba(255, 255, 255, 1);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        /* System Icons */
        .system-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .system-icon {
          padding: 4px 6px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .system-icon svg {
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.2s ease;
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
        }

        .system-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transform: scale(1.05);
        }

        .system-icon:hover svg {
          color: rgba(255, 255, 255, 1);
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
          transform: scale(1.1);
        }

        .system-icon:active {
          transform: scale(0.95);
          background: rgba(255, 255, 255, 0.15);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .macos-register-container {
            padding: 1rem;
          }

          .register-form,
          .otp-form {
            padding: 2rem 1.5rem;
            border-radius: 20px;
          }

          .register-title,
          .otp-title {
            font-size: 1.6rem;
          }

          .macos-toaster {
            right: 16px;
            left: 16px;
            top: 70px;
          }

          .macos-menubar {
            padding: 0 16px;
          }

          .photo-upload-label {
            width: 80px;
            height: 80px;
          }

          .photo-icon {
            font-size: 1.5rem;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
} 