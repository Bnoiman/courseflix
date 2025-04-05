// CourseFlixAI Mobile Responsive Frontend - Footer Component
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Footer component for CourseFlixAI
 * Provides site navigation, social links, and legal information
 */
const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <Image 
              src="/images/courseflix-logo.svg" 
              alt="CourseFlixAI" 
              width={140} 
              height={40} 
            />
            <p className="tagline">Discover Your Learning Path</p>
          </div>
          
          <div className="social-links">
            <a href="https://twitter.com/courseflixai" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </a>
            <a href="https://facebook.com/courseflixai" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
              </svg>
            </a>
            <a href="https://instagram.com/courseflixai" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a href="https://linkedin.com/company/courseflixai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a href="https://youtube.com/courseflixai" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h3>Explore</h3>
            <ul>
              <li><Link href="/courses">All Courses</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/providers">Course Providers</Link></li>
              <li><Link href="/trending">Trending Courses</Link></li>
              <li><Link href="/new">New Releases</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Account</h3>
            <ul>
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/my-list">My List</Link></li>
              <li><Link href="/continue-learning">Continue Learning</Link></li>
              <li><Link href="/settings">Account Settings</Link></li>
              <li><Link href="/help">Help Center</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/press">Press</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
              <li><Link href="/accessibility">Accessibility</Link></li>
              <li><Link href="/sitemap">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} CourseFlixAI. All rights reserved.
          </div>
          
          <div className="app-links">
            <a href="#" className="app-link">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span>iOS App</span>
            </a>
            <a href="#" className="app-link">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M3.18 23c-.18 0-.36-.03-.53-.08a1.5 1.5 0 0 1-.97-1.42V2.5c0-.83.67-1.5 1.5-1.5.18 0 .35.03.53.08L21.5 12l-17.82 10.92c-.16.1-.33.08-.5.08z" />
              </svg>
              <span>Android App</span>
            </a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background-color: #0a0a0a;
          color: #b3b3b3;
          padding: 60px 0 30px;
          margin-top: 60px;
        }
        
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        
        .footer-logo {
          display: flex;
          flex-direction: column;
        }
        
        .tagline {
          margin: 10px 0 0;
          font-size: 14px;
          color: #e50914;
        }
        
        .social-links {
          display: flex;
        }
        
        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #1a1a1a;
          color: #b3b3b3;
          margin-left: 10px;
          transition: all 0.2s ease;
        }
        
        .social-links a:hover {
          background-color: #e50914;
          color: #ffffff;
          transform: translateY(-3px);
        }
        
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        
        .footer-section {
          flex: 1;
          min-width: 200px;
          margin-bottom: 30px;
        }
        
        .footer-section h3 {
          color: #ffffff;
          font-size: 16px;
          margin: 0 0 20px;
          font-weight: 600;
        }
        
        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-section li {
          margin-bottom: 10px;
        }
        
        .footer-section a {
          color: #b3b3b3;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        
        .footer-section a:hover {
          color: #ffffff;
        }
        
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 30px;
          border-top: 1px solid #2a2a2a;
        }
        
        .copyright {
          font-size: 14px;
        }
        
        .app-links {
          display: flex;
        }
        
        .app-link {
          display: flex;
          align-items: center;
          color: #b3b3b3;
          text-decoration: none;
          margin-left: 20px;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        
        .app-link:hover {
          color: #ffffff;
        }
        
        .app-link svg {
          margin-right: 8px;
        }
        
        /* Mobile adjustments */
        @media (max-width: 767px) {
          .footer {
            padding: 40px 0 20px;
            margin-top: 40px;
          }
          
          .footer-container {
            padding: 0 16px;
          }
          
          .footer-top {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 30px;
          }
          
          .social-links {
            margin-top: 20px;
          }
          
          .social-links a {
            margin-left: 0;
            margin-right: 10px;
          }
          
          .footer-section {
            min-width: 50%;
          }
          
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .copyright {
            margin-bottom: 15px;
          }
          
          .app-links {
            margin-top: 10px;
          }
          
          .app-link {
            margin-left: 0;
            margin-right: 20px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
