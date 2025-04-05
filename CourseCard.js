// CourseFlixAI Mobile Responsive Frontend - Course Card Component
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Course Card component for CourseFlixAI
 * Displays course information in a Netflix-style card with hover effects
 */
const CourseCard = ({ course, layout = 'standard' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Default course data if not provided
  const defaultCourse = {
    id: 'default-course',
    title: 'Course Title',
    provider: 'Provider Name',
    thumbnail: '/images/default-course-thumbnail.jpg',
    rating: 4.5,
    level: 'Beginner',
    duration: '10 hours',
    category: 'Programming',
    progress: 0
  };
  
  // Merge with defaults
  const courseData = { ...defaultCourse, ...course };
  
  // Handle mouse events
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  // Format rating to display with one decimal place
  const formattedRating = parseFloat(courseData.rating).toFixed(1);
  
  // Calculate progress percentage
  const progressPercentage = courseData.progress || 0;
  
  return (
    <div 
      className={`course-card ${layout} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/course/${courseData.id}`} className="card-link">
        <div className="thumbnail-container">
          <Image 
            src={courseData.thumbnail} 
            alt={courseData.title}
            width={layout === 'featured' ? 640 : 320}
            height={layout === 'featured' ? 360 : 180}
            className="thumbnail"
          />
          
          {progressPercentage > 0 && (
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          )}
          
          {isHovered && (
            <div className="hover-overlay">
              <div className="play-button">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        <div className="card-content">
          <h3 className="course-title">{courseData.title}</h3>
          
          <div className="course-meta">
            <div className="provider">{courseData.provider}</div>
            
            <div className="rating">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#FFD700" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>{formattedRating}</span>
            </div>
          </div>
          
          <div className="course-details">
            <span className="level">{courseData.level}</span>
            <span className="duration">{courseData.duration}</span>
          </div>
          
          {isHovered && (
            <div className="hover-details">
              <div className="category-tag">{courseData.category}</div>
              
              <div className="action-buttons">
                <button className="action-button" aria-label="Add to My List">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
                
                <button className="action-button" aria-label="More Info">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </Link>
      
      <style jsx>{`
        .course-card {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background-color: #1a1a1a;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin: 10px;
          flex-shrink: 0;
        }
        
        .course-card.standard {
          width: 280px;
        }
        
        .course-card.featured {
          width: 100%;
          max-width: 600px;
        }
        
        .course-card.small {
          width: 200px;
        }
        
        .course-card.hovered {
          transform: scale(1.05);
          z-index: 10;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
        
        .card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }
        
        .thumbnail-container {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .thumbnail {
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .course-card.hovered .thumbnail {
          transform: scale(1.1);
        }
        
        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .progress-fill {
          height: 100%;
          background-color: #e50914;
        }
        
        .hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .course-card.hovered .hover-overlay {
          opacity: 1;
        }
        
        .play-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: background-color 0.2s ease;
        }
        
        .play-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .card-content {
          padding: 15px;
        }
        
        .course-title {
          margin: 0 0 10px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .course-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .provider {
          color: #b3b3b3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 70%;
        }
        
        .rating {
          display: flex;
          align-items: center;
          color: #b3b3b3;
        }
        
        .rating svg {
          margin-right: 4px;
        }
        
        .course-details {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #b3b3b3;
        }
        
        .hover-details {
          margin-top: 10px;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease;
        }
        
        .course-card.hovered .hover-details {
          max-height: 100px;
        }
        
        .category-tag {
          display: inline-block;
          padding: 3px 8px;
          background-color: #e50914;
          color: white;
          border-radius: 3px;
          font-size: 12px;
          margin-bottom: 10px;
        }
        
        .action-buttons {
          display: flex;
          justify-content: flex-end;
        }
        
        .action-button {
          background: none;
          border: 1px solid #b3b3b3;
          color: #b3b3b3;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .action-button:hover {
          border-color: #ffffff;
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        /* Mobile adjustments */
        @media (max-width: 767px) {
          .course-card.standard, .course-card.small {
            width: 160px;
            margin: 5px;
          }
          
          .course-card.featured {
            max-width: 100%;
          }
          
          .card-content {
            padding: 10px;
          }
          
          .course-title {
            font-size: 14px;
            margin-bottom: 5px;
          }
          
          .course-meta, .course-details {
            font-size: 12px;
          }
          
          .hover-details {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseCard;
