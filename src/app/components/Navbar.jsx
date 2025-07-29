"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <nav className="navbar-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <img src="https://ik.imagekit.io/cybershoora/CS%20Rippers/Logos/cs-ripper.svg?updatedAt=1753406689587" alt="Logo" className="navbar-logo" />
            <span className="text-2xl font-extrabold tracking-tight flex items-center">
              
              <span className="logo-text">CS Rippers</span>
            </span>
          </Link>
          {/* Nav Links */}
          <div className="flex gap-2 md:gap-6 items-center text-base font-semibold">
            <Link href="/" className="px-3 py-1 rounded-lg text-gray-200 hover:text-orange-400 transition-colors">Home</Link>
            <Link href="/about" className="px-3 py-1 rounded-lg text-gray-200 hover:text-orange-400 transition-colors">About Us</Link>
            <Link href="/register" className="get-started-btn">Get Started</Link>
          </div>
        </div>
      </nav>
      <style jsx>{`
        .navbar-blur {
          width: 100%;
          background: rgba(10, 10, 10, 0.05); /* #0A0A0A with 5% opacity */
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1.5px solid #232526;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .max-w-7xl {
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }
        .flex {
          display: flex;
        }
        .items-center {
          align-items: center;
        }
        .justify-between {
          justify-content: space-between;
        }
        .gap-2 {
          gap: 0.5rem;
        }
        .gap-6 {
          gap: 1.5rem;
        
        }

        .logo-text{
          font-size: 1.5rem;
          font-weight: 200;
          }
        .text-2xl {
          font-size: 2rem;
        }
        .font-extrabold {
          font-weight: 800;
        }
        .tracking-tight {
          letter-spacing: -0.02em;
        }
        .bg-gradient-to-r {
          background: linear-gradient(to right, #ff9800, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-transparent {
          color: transparent;
        }
        .text-white {
          color: #fff;
        }
        .ml-1 {
          margin-left: 0.25rem;
        }
        .rounded-lg {
          border-radius: 0.5rem;
        }
        .text-gray-200 {
          color: #e5e7eb;
        }
        .hover\:text-orange-400:hover {
          color: #ff9800;
        }
        .transition-colors {
          transition: color 0.2s;
        }
        .ml-2 {
          margin-left: 0.5rem;
        }
        .px-5 {
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .bg-gradient-to-r {
          background: linear-gradient(to right, #a21caf, #ff9800);
        }
        .shadow {
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .hover\:scale-105:hover {
          transform: scale(1.05);
        }
        .transition-transform {
          transition: transform 0.2s;
        }
        .get-started-btn {
          background: #d84309;
          color: #fff;
          border-radius: 0.75rem;
          padding: 0.5rem 1.5rem;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 2px 12px rgba(216,67,9,0.10);
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          border: none;
          outline: none;
          display: inline-block;
        }
        .get-started-btn:hover {
          background: #b83607;
          transform: scale(1.05);
          box-shadow: 0 4px 24px rgba(216,67,9,0.15);
        }
        .navbar-logo {
          height: 32px;
          width: 32px;
          margin-right: 0.5rem;
          display: inline-block;
          vertical-align: middle;
        }
        .cs-orange {
          color: #d84309;
          font-weight: 800;
        }
      `}</style>
    </>
  );
} 