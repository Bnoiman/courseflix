// CourseFlixAI Mobile Responsive Frontend - Sidebar Component
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Sidebar component for CourseFlixAI
 * Provides navigation and category filtering
 */
const Sidebar = ({ isOpen, isMobile, closeSidebar }) => {
  const router = useRouter();
  const sidebarRef = useRef(null);
  
  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isOpen, closeSidebar]);
  
  // Categories for sidebar navigation
  const categories = [
    { id: 'programming', name: 'Programming', icon: 'code' },
    { id: 'data-science', name: 'Data Science', icon: 'analytics' },
    { id: 'web-development', name: 'Web Development', icon: 'web' },
    { id: 'mobile-development', name: 'Mobile Development', icon: 'smartphone' },
    { id: 'design', name: 'Design', icon: 'design' },
    { id: 'business', name: 'Business', icon: 'business' },
    { id: 'marketing', name: 'Marketing', icon: 'campaign' },
    { id: 'photography', name: 'Photography', icon: 'camera' },
    { id: 'music', name: 'Music', icon: 'music_note' },
    { id: 'health', name: 'Health & Fitness', icon: 'fitness_center' }
  ];
  
  // Get icon component based on icon name
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'code':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>;
      case 'analytics':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>;
      case 'web':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/></svg>;
      case 'smartphone':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>;
      case 'design':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>;
      case 'business':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>;
      case 'campaign':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z"/></svg>;
      case 'camera':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9.4 10.5l4.77-8.26C13.47 2.09 12.75 2 12 2c-2.4 0-4.6.85-6.32 2.25l3.66 6.35.06-.1zM21.54 9c-.92-2.92-3.15-5.26-6-6.34L11.88 9h9.66zm.26 1h-7.49l.29.5 4.76 8.25C21 16.97 22 14.61 22 12c0-.69-.07-1.35-.2-2zM8.54 12l-3.9-6.75C3.01 7.03 2 9.39 2 12c0 .69.07 1.35.2 2h7.49l-1.15-2zm-6.08 3c.92 2.92 3.15 5.26 6 6.34L12.12 15H2.46zm11.27 0l-3.9 6.76c.7.15 1.42.24 2.17.24 2.4 0 4.6-.85 6.32-2.25l-3.66-6.35-.93 1.6z"/></svg>;
      case 'music_note':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>;
      case 'fitness_center':
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>;
      default:
        return <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>;
    }
  };
  
  return (
    <aside 
      ref={sidebarRef}
      className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}
    >
      {isMobile && (
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button 
            className="close-button" 
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      )}
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3>Browse</h3>
          <ul>
            <li className={router.pathname === '/' ? 'active' : ''}>
              <Link href="/">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span>Home</span>
              </Link>
            </li>
            <li className={router.pathname === '/courses' ? 'active' : ''}>
              <Link href="/courses">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                </svg>
                <span>All Courses</span>
              </Link>
            </li>
            <li className={router.pathname === '/my-list' ? 'active' : ''}>
              <Link href="/my-list">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
                </svg>
                <span>My List</span>
              </Link>
            </li>
            <li className={router.pathname === '/continue-learning' ? 'active' : ''}>
              <Link href="/continue-learning">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M4 18l8.5-6L4 6v12zm9-12v12h2V6h-2zm5 0v12h2V6h-2z" />
                </svg>
                <span>Continue Learning</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="nav-section">
          <h3>Categories</h3>
          <ul>
            {categories.map(category => (
              <li 
                key={category.id} 
                className={router.query.category === category.id ? 'active' : ''}
              >
                <Link href={`/category/${category.id}`}>
                  {getIcon(category.icon)}
                  <span>{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="nav-section">
          <h3>Account</h3>
          <ul>
            <li className={router.pathname === '/profile' ? 'active' : ''}>
              <Link href="/profile">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span>Profile</span>
              </Link>
            </li>
            <li className={router.pathname === '/settings' ? 'active' : ''}>
              <Link href="/settings">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link href="/logout">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      
      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 250px;
          background-color: #141414;
          color: #e5e5e5;
          overflow-y: auto;
          z-index: 1001;
          padding: 20px 0;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        
        .sidebar.open {
          transform: translateX(0);
        }
        
        .sidebar.mobile {
          top: 0;
          padding-top: 0;
        }
        
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #2a2a2a;
        }
        
        .sidebar-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .close-button {
          background: none;
          border: none;
          color: #e5e5e5;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        
        .close-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-nav {
          padding: 0 20px;
        }
        
        .nav-section {
          margin-bottom: 30px;
        }
        
        .nav-section h3 {
          font-size: 14px;
          text-transform: uppercase;
          color: #b3b3b3;
          margin: 0 0 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #2a2a2a;
        }
        
        .nav-section ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-section li {
          margin-bottom: 5px;
        }
        
        .nav-section a {
          display: flex;
          align-items: center;
          color: #e5e5e5;
          text-decoration: none;
          padding: 10px;
          border-radius: 4px;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        
        .nav-section a:hover, .nav-section li.active a {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        
        .nav-section li.active a {
          color: #e50914;
        }
        
        .nav-section a svg {
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        /* Scrollbar styling */
        .sidebar::-webkit-scrollbar {
          width: 5px;
        }
        
        .sidebar::-webkit-scrollbar-track {
          background: #141414;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 3px;
        }
        
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #3a3a3a;
        }
        
        /* Desktop styles */
        @media (min-width: 768px) {
          .sidebar {
            top: 70px;
            transform: translateX(-100%);
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
