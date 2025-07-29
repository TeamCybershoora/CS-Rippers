"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (!localStorage.getItem("isLoggedIn") || !localStorage.getItem("isOtpVerified"))
    ) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isOtpVerified");
    router.replace("/");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Welcome to your Dashboard!
      </h1>
      <p className="dashboard-desc">
        You are successfully logged in.
      </p>
      <button onClick={handleLogout} className="dashboard-logout">
        Logout
      </button>
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #232526, #414345);
          color: #fff;
        }
        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 16px;
          background: linear-gradient(90deg, #00b4db, #0083b0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dashboard-desc {
          font-size: 1.2rem;
          margin-bottom: 32px;
          color: #b2f5ea;
        }
        .dashboard-logout {
          padding: 12px 32px;
          border-radius: 8px;
          border: none;
          background: #00b4db;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(0,180,219,0.15);
          transition: background 0.2s;
        }
        .dashboard-logout:hover {
          background: #0083b0;
        }
      `}</style>
    </div>
  );
} 