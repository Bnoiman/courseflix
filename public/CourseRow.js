// CourseFlixAI Mobile Responsive Frontend - CourseRow Component
import React, { useRef, useState, useEffect } from 'react';
import CourseCard from './CourseCard';

/**
 * CourseRow component for CourseFlixAI
 * Displays a horizontal scrolling row of course cards in Netflix style
 */
const CourseRow = ({ title, courses = [], layout = 'standard' }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  // Check if arrows should be shown based on scroll position
  const checkArrows = () => {
    if (!rowRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  // Add scroll event listener to check arrows
  useEffect(() => {
    const row = rowRef.current;
    if (row) {
      row.addEventListener('scroll', checkArrows);
      // Initial check
      checkArrows();
      
      return () => row.removeEventListener('scroll', checkArrows);
    }
  }, []);

  // Scroll row left
  const scrollLeft = () => {
    if (!rowRef.current) return;
    
    const scrollAmount = isMobile ? 160 * 2 : 280 * 2; // Scroll 2 cards
    rowRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  };

  // Scroll row right
  const scrollRight = () => {
    if (!rowRef.current) return;
    
    const scrollAmount = isMobile ? 160 * 2 : 280 * 2; // Scroll 2 cards
    rowRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  // Handle mouse down for drag scrolling
  const handleMouseDown = (e) => {
    if (!rowRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };

  // Handle touch start for drag scrolling on mobile
  const handleTouchStart = (e) => {
    if (!rowRef.current) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };

  // Handle mouse move for drag scrolling
  const handleMouseMove = (e) => {
    if (!isDragging || !rowRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    rowRef.current.scrollLeft = scrollLeft - walk;
    checkArrows();
  };

  // Handle touch move for drag scrolling on mobile
  const handleTouchMove = (e) => {
    if (!isDragging || !rowRef.current) return;
    
    const x = e.touches[0].pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    rowRef.current.scrollLeft = scrollLeft - walk;
    checkArrows();
  };

  // Handle mouse up to end drag scrolling
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leave to end drag scrolling
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Handle touch end to end drag scrolling on mobile
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="course-row">
      <div className="row-header">
        <h2 className="row-title">{title}</h2>
        
        {courses.length > 0 && (
          <button className="see-all-button">
            See All
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="row-content">
        {!isMobile && showLeftArrow && (
          <button 
            className="scroll-arrow left"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        )}
        
        <div 
          className="courses-container"
          ref={rowRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {courses.length > 0 ? (
            courses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                layout={layout}
              />
            ))
          ) : (
            // Placeholder cards when no courses are provided
            Array.from({ length: 6 }).map((_, index) => (
              <CourseCard 
                key={`placeholder-${index}`} 
                layout={layout}
              />
            ))
          )}
        </div>
        
        {!isMobile && showRightArrow && (
          <button 
            className="scroll-arrow right"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        )}
      </div>
      
      <style jsx>{`
        .course-row {
          margin-bottom: 40px;
        }
        
        .row-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
          padding: 0 20px;
        }
        
        .row-title {
          font-size: 22px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
        
        .see-all-button {
          background: none;
          border: none;
          color: #b3b3b3;
          font-size: 14px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .see-all-button:hover {
          color: #ffffff;
        }
        
        .see-all-button svg {
          margin-left: 5px;
        }
        
        .row-content {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .courses-container {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
          padding: 10px 20px;
          cursor: grab;
        }
        
        .courses-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        .courses-container.dragging {
          cursor: grabbing;
          scroll-behavior: auto;
        }
        
        .scroll-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(20, 20, 20, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        
        .scroll-arrow:hover {
          background-color: rgba(20, 20, 20, 0.9);
          transform: translateY(-50%) scale(1.1);
        }
        
        .scroll-arrow.left {
          left: 10px;
        }
        
        .scroll-arrow.right {
          right: 10px;
        }
        
        /* Mobile adjustments */
        @media (max-width: 767px) {
          .row-header {
            padding: 0 16px;
          }
          
          .row-title {
            font-size: 18px;
          }
          
          .courses-container {
            padding: 5px 16px;
          }
          
          .course-row {
            margin-bottom: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseRow;
