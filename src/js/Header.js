// CourseFlixAI Mobile Responsive Frontend - Header Component
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

/**
 * Header component for CourseFlixAI
 * Includes responsive navigation and search functionality
 */
const Header = ({ toggleSidebar, toggleChat }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Check if device is mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  // Toggle search input visibility
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Menu button (only visible on desktop) */}
        {!isMobile && (
          <button 
            className="menu-button" 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
        )}
        
        {/* Logo */}
        <Link href="/" className="logo">
          <div className="logo-container">
            <Image 
              src="/images/courseflix-logo.svg" 
              alt="CourseFlixAI" 
              width={140} 
              height={40} 
              priority
            />
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="desktop-nav">
            <ul>
              <li className={router.pathname === '/' ? 'active' : ''}>
                <Link href="/">Home</Link>
              </li>
              <li className={router.pathname === '/courses' ? 'active' : ''}>
                <Link href="/courses">Courses</Link>
              </li>
              <li className={router.pathname === '/categories' ? 'active' : ''}>
                <Link href="/categories">Categories</Link>
              </li>
              <li className={router.pathname === '/my-list' ? 'active' : ''}>
                <Link href="/my-list">My List</Link>
              </li>
            </ul>
          </nav>
        )}
        
        {/* Right side controls */}
        <div className="header-controls">
          {/* Search */}
          <div className={`search-container ${searchOpen ? 'open' : ''}`}>
            <button 
              className="search-button" 
              onClick={toggleSearch}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
            
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search courses"
              />
              <button type="submit" aria-label="Submit search">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </button>
            </form>
          </div>
          
          {/* Chat button (only visible on desktop) */}
          {!isMobile && (
            <button 
              className="chat-button" 
              onClick={toggleChat}
              aria-label="Open AI chat assistant"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                <path fill="currentColor" d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z" />
              </svg>
            </button>
          )}
          
          {/* User profile */}
          <div className="user-profile">
            <Link href="/profile">
              <div className="profile-avatar">
                <Image 
                  src="/images/default-avatar.png" 
                  alt="User Profile" 
                  width={32} 
                  height={32} 
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          z-index: 1000;
          transition: background-color 0.3s ease;
          background: linear-gradient(to bottom, rgba(20, 20, 20, 0.9) 0%, rgba(20, 20, 20, 0) 100%);
        }
        
        .header.scrolled {
          background-color: rgba(20, 20, 20, 0.9);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 20px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .menu-button, .chat-button {
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        
        .menu-button:hover, .chat-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .logo-container {
          height: 40px;
          display: flex;
          align-items: center;
        }
        
        .desktop-nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .desktop-nav li {
          margin: 0 15px;
        }
        
        .desktop-nav a {
          color: #e5e5e5;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .desktop-nav a:hover, .desktop-nav li.active a {
          color: #ffffff;
        }
        
        .header-controls {
          display: flex;
          align-items: center;
        }
        
        .search-container {
          position: relative;
          margin-right: 15px;
        }
        
        .search-button {
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        
        .search-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .search-form {
          position: absolute;
          right: 0;
          top: 100%;
          width: 0;
          overflow: hidden;
          transition: width 0.3s ease;
          display: flex;
          background-color: #2a2a2a;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .search-container.open .search-form {
          width: 250px;
        }
        
        .search-form input {
          flex: 1;
          border: none;
          background: none;
          padding: 10px 15px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
        }
        
        .search-form button {
          background: none;
          border: none;
          color: #ffffff;
          padding: 10px;
          cursor: pointer;
        }
        
        .user-profile {
          margin-left: 15px;
        }
        
        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .profile-avatar:hover {
          transform: scale(1.05);
        }
        
        /* Mobile adjustments */
        @media (max-width: 767px) {
          .header-container {
            padding: 0 16px;
          }
          
          .logo-container {
            height: 30px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
