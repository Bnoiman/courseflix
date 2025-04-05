// CourseFlixAI Mobile Responsive Frontend - Main Layout Component
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';
import MobileNavigation from './MobileNavigation';

/**
 * Main layout component for CourseFlixAI
 * Handles responsive behavior and common layout elements
 */
const Layout = ({ children, title = 'CourseFlixAI - Discover Your Learning Path' }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const router = useRouter();

  // Check if device is mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Close sidebar automatically on mobile when resizing
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    
    // Close chat if opening sidebar on mobile
    if (isMobile && !sidebarOpen) {
      setChatOpen(false);
    }
  };

  // Toggle chat interface
  const toggleChat = () => {
    setChatOpen(!chatOpen);
    
    // Close sidebar if opening chat on mobile
    if (isMobile && !chatOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="layout-container">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Discover your perfect learning path with CourseFlixAI - AI-powered course recommendations" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* PWA meta tags for mobile app-like experience */}
        <meta name="application-name" content="CourseFlixAI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CourseFlixAI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#141414" />
        
        {/* PWA icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Header toggleSidebar={toggleSidebar} toggleChat={toggleChat} />
      
      <div className="main-content">
        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} closeSidebar={() => setSidebarOpen(false)} />
        
        <main className={`content ${sidebarOpen ? 'sidebar-open' : ''} ${chatOpen ? 'chat-open' : ''}`}>
          {children}
        </main>
        
        <ChatInterface isOpen={chatOpen} isMobile={isMobile} closeChat={() => setChatOpen(false)} />
      </div>
      
      {isMobile && <MobileNavigation 
        currentPath={router.pathname}
        toggleSidebar={toggleSidebar}
        toggleChat={toggleChat}
      />}
      
      <Footer />
      
      <style jsx>{`
        .layout-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #141414;
          color: #ffffff;
        }
        
        .main-content {
          display: flex;
          flex: 1;
          position: relative;
        }
        
        .content {
          flex: 1;
          padding: 20px;
          transition: all 0.3s ease;
        }
        
        /* Responsive adjustments */
        @media (max-width: 767px) {
          .content {
            padding: 16px;
            padding-bottom: 70px; /* Space for mobile navigation */
          }
          
          .content.sidebar-open,
          .content.chat-open {
            opacity: 0.3;
            pointer-events: none;
          }
        }
        
        @media (min-width: 768px) {
          .content.sidebar-open {
            margin-left: 250px;
          }
          
          .content.chat-open {
            margin-right: 320px;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
