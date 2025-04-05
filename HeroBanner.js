// CourseFlixAI Mobile Responsive Frontend - HeroBanner Component
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * HeroBanner component for CourseFlixAI
 * Displays a large featured course banner in Netflix style
 */
const HeroBanner = ({ course }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Default course data if not provided
  const defaultCourse = {
    id: 'featured-course',
    title: 'Master Web Development with React & Node.js',
    description: 'Learn to build modern, responsive web applications from scratch with the most popular JavaScript frameworks. This comprehensive course covers frontend and backend development.',
    provider: 'Tech Academy',
    thumbnail: '/images/featured-course-banner.jpg',
    rating: 4.8,
    level: 'Intermediate',
    duration: '40 hours',
    category: 'Web Development',
    tags: ['JavaScript', 'React', 'Node.js', 'MongoDB']
  };
  
  // Merge with defaults
  const courseData = { ...defaultCourse, ...course };
  
  // Handle mouse events
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  return (
    <div 
      className={`hero-banner ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="banner-image">
        <Image 
          src={courseData.thumbnail} 
          alt={courseData.title}
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        <div className="banner-overlay"></div>
      </div>
      
      <div className="banner-content">
        <h1 className="banner-title">{courseData.title}</h1>
        
        <div className="banner-meta">
          <div className="provider">{courseData.provider}</div>
          
          <div className="rating">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="#FFD700" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span>{courseData.rating}</span>
          </div>
          
          <div className="level">{courseData.level}</div>
          <div className="duration">{courseData.duration}</div>
        </div>
        
        <p className="banner-description">{courseData.description}</p>
        
        <div className="banner-tags">
          {courseData.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="banner-actions">
          <Link href={`/course/${courseData.id}`} className="primary-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
            <span>Start Learning</span>
          </Link>
          
          <button className="secondary-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>Add to My List</span>
          </button>
          
          <button className="info-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span>More Info</span>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .hero-banner {
          position: relative;
          width: 100%;
          height: 80vh;
          max-height: 700px;
          min-height: 400px;
          margin-bottom: 40px;
          overflow: hidden;
        }
        
        .banner-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(20, 20, 20, 0.9) 0%,
            rgba(20, 20, 20, 0.7) 30%,
            rgba(20, 20, 20, 0.4) 60%,
            rgba(20, 20, 20, 0.2) 100%
          );
        }
        
        .banner-content {
          position: relative;
          z-index: 10;
          max-width: 600px;
          padding: 60px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .banner-title {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 20px;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .banner-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
          font-size: 1rem;
          color: #e5e5e5;
        }
        
        .banner-meta > div {
          margin-right: 20px;
          display: flex;
          align-items: center;
        }
        
        .rating svg {
          margin-right: 5px;
        }
        
        .banner-description {
          font-size: 1.1rem;
          line-height: 1.5;
          margin-bottom: 20px;
          color: #e5e5e5;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .banner-tags {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }
        
        .tag {
          background-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 5px 10px;
          border-radius: 4px;
          margin-right: 10px;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }
        
        .banner-actions {
          display: flex;
          flex-wrap: wrap;
        }
        
        .primary-button, .secondary-button, .info-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 15px;
          margin-bottom: 15px;
        }
        
        .primary-button {
          background-color: #e50914;
          color: #ffffff;
          border: none;
          text-decoration: none;
        }
        
        .primary-button:hover {
          background-color: #f40612;
          transform: scale(1.05);
        }
        
        .secondary-button {
          background-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border: none;
        }
        
        .secondary-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .info-button {
          background: none;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        
        .info-button:hover {
          border-color: #ffffff;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .primary-button svg, .secondary-button svg, .info-button svg {
          margin-right: 8px;
        }
        
        /* Mobile adjustments */
        @media (max-width: 767px) {
          .hero-banner {
            height: 60vh;
            min-height: 350px;
            margin-bottom: 30px;
          }
          
          .banner-overlay {
            background: linear-gradient(
              to top,
              rgba(20, 20, 20, 1) 0%,
              rgba(20, 20, 20, 0.8) 40%,
              rgba(20, 20, 20, 0.4) 80%,
              rgba(20, 20, 20, 0.2) 100%
            );
          }
          
          .banner-content {
            padding: 20px;
            justify-content: flex-end;
            max-width: 100%;
          }
          
          .banner-title {
            font-size: 1.8rem;
            margin-bottom: 10px;
          }
          
          .banner-meta {
            font-size: 0.9rem;
            margin-bottom: 10px;
          }
          
          .banner-description {
            font-size: 1rem;
            margin-bottom: 15px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .banner-tags {
            margin-bottom: 20px;
          }
          
          .tag {
            font-size: 0.8rem;
            padding: 4px 8px;
            margin-right: 8px;
            margin-bottom: 8px;
          }
          
          .primary-button, .secondary-button, .info-button {
            padding: 8px 16px;
            font-size: 0.9rem;
            margin-right: 10px;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;
