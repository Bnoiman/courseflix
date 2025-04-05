// CourseFlixAI Mobile Responsive Frontend - Mobile Navigation Component
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Mobile Navigation component for CourseFlixAI
 * Provides bottom navigation bar for mobile devices
 */
const MobileNavigation = ({ currentPath, toggleSidebar, toggleChat }) => {
  const router = useRouter();
  
  return (
    <nav className="mobile-navigation">
      <div className="nav-items">
        <Link href="/" className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Home</span>
        </Link>
        
        <Link href="/courses" className={`nav-item ${currentPath === '/courses' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
          </svg>
          <span>Courses</span>
        </Link>
        
        <button className="nav-item chat-button" onClick={toggleChat}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
            <path fill="currentColor" d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z" />
          </svg>
          <span>AI Chat</span>
        </button>
        
        <Link href="/my-list" className={`nav-item ${currentPath === '/my-list' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
          </svg>
          <span>My List</span>
        </Link>
        
        <button className="nav-item menu-button" onClick={toggleSidebar}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
          <span>Menu</span>
        </button>
      </div>
      
      <style jsx>{`
        .mobile-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(20, 20, 20, 0.95);
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          height: 60px;
          display: flex;
          align-items: center;
        }
        
        .nav-items {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
        }
        
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #b3b3b3;
          text-decoration: none;
          font-size: 10px;
          padding: 8px 0;
          width: 20%;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .nav-item.active, .nav-item:hover {
          color: #e50914;
        }
        
        .nav-item svg {
          margin-bottom: 4px;
        }
        
        .nav-item span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        
        .chat-button {
          position: relative;
        }
        
        /* Add a small red dot for notification */
        .chat-button::after {
          content: '';
          position: absolute;
          top: 6px;
          right: calc(50% - 18px);
          width: 8px;
          height: 8px;
          background-color: #e50914;
          border-radius: 50%;
          border: 1px solid #141414;
        }
      `}</style>
    </nav>
  );
};

export default MobileNavigation;
