// CourseFlixAI - Prototype Feedback Component
import React, { useState } from 'react';
import prototypeConfig from './prototype.config';

/**
 * FeedbackForm component for CourseFlixAI
 * Allows users to provide feedback on the prototype
 */
const FeedbackForm = () => {
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real implementation, this would send an API request
    // For the prototype, we'll just simulate a submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      
      // Reset form after submission
      setFeedbackType('general');
      setRating(0);
      setComment('');
      setEmail('');
      
      // Reset submitted state after a delay
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="feedback-form">
      <div className="feedback-header">
        <h2>Provide Feedback</h2>
        <p>Help us improve CourseFlixAI by sharing your thoughts</p>
      </div>
      
      {submitted ? (
        <div className="success-message">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <h3>Thank You!</h3>
          <p>Your feedback has been submitted successfully. We appreciate your input!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Feedback Type</label>
            <div className="feedback-types">
              <button 
                type="button"
                className={`type-button ${feedbackType === 'general' ? 'active' : ''}`}
                onClick={() => setFeedbackType('general')}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
                </svg>
                <span>General</span>
              </button>
              
              <button 
                type="button"
                className={`type-button ${feedbackType === 'ui' ? 'active' : ''}`}
                onClick={() => setFeedbackType('ui')}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z" />
                  <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor" />
                  <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor" />
                  <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor" />
                  <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor" />
                </svg>
                <span>UI/UX</span>
              </button>
              
              <button 
                type="button"
                className={`type-button ${feedbackType === 'ai' ? 'active' : ''}`}
                onClick={() => setFeedbackType('ai')}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M21 11.18V9.72c0-.47-.16-.92-.46-1.28L16.6 3.72c-.38-.46-.94-.72-1.54-.72H8.94c-.6 0-1.15.26-1.54.72L3.46 8.44c-.3.36-.46.81-.46 1.28v1.45c0 .8.48 1.52 1.23 1.83v5.15c0 .46.37.83.83.83h14c.45 0 .82-.37.82-.82v-5.15c.74-.31 1.22-1.03 1.22-1.83zM12 17.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM5.94 10H8v1H5.94c-.27 0-.52-.11-.71-.29-.18-.18-.29-.44-.29-.71 0-.55.45-1 1-1h1.18l1.03-1.3c.2-.25.5-.4.82-.4h4.05c.33 0 .63.15.83.4l1.03 1.3H15c.55 0 1 .45 1 1 0 .27-.11.53-.29.71-.19.18-.44.29-.71.29H13v-1h2.06l-.22-.28c-.2-.25-.5-.4-.83-.4h-4.03c-.32 0-.62.15-.82.4l-.22.28H11v1H8.94z" />
                </svg>
                <span>AI Features</span>
              </button>
              
              <button 
                type="button"
                className={`type-button ${feedbackType === 'bug' ? 'active' : ''}`}
                onClick={() => setFeedbackType('bug')}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
                </svg>
                <span>Bug Report</span>
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Rate Your Experience</label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
              ))}
            </div>
            <div className="rating-text">
              {rating === 0 && 'Select a rating'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="comment">Your Feedback</label>
            <textarea
              id="comment"
              rows="4"
              placeholder={
                feedbackType === 'general' ? 'Share your overall thoughts about the prototype...' :
                feedbackType === 'ui' ? 'Tell us about your experience with the user interface...' :
                feedbackType === 'ai' ? 'How was your experience with the AI recommendation features?' :
                'Please describe the bug or issue you encountered...'
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email (Optional)</label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="email-note">We'll only use this to follow up on your feedback if needed</div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || rating === 0 || !comment.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </form>
      )}
      
      <style jsx>{`
        .feedback-form {
          background-color: #1a1a1a;
          border-radius: 8px;
          padding: 24px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
        
        .feedback-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .feedback-header h2 {
          font-size: 24px;
          margin-bottom: 8px;
          color: #ffffff;
        }
        
        .feedback-header p {
          color: #b3b3b3;
          font-size: 14px;
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 12px;
          font-size: 16px;
          color: #e5e5e5;
          font-weight: 500;
        }
        
        .feedback-types {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .type-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #2a2a2a;
          border: 2px solid transparent;
          border-radius: 8px;
          padding: 16px;
          color: #b3b3b3;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          min-width: 100px;
        }
        
        .type-button svg {
          margin-bottom: 8px;
        }
        
        .type-button:hover {
          background-color: #3a3a3a;
          color: #ffffff;
        }
        
        .type-button.active {
          background-color: rgba(229, 9, 20, 0.1);
          border-color: #e50914;
          color: #e50914;
        }
        
        .rating-container {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
        }
        
        .star-button {
          background: none;
          border: none;
          color: #b3b3b3;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        
        .star-button:hover {
          transform: scale(1.1);
          color: #FFD700;
        }
        
        .star-button.active {
          color: #FFD700;
        }
        
        .rating-text {
          text-align: center;
          font-size: 14px;
          color: #b3b3b3;
          height: 20px;
        }
        
        textarea, input[type="email"] {
          width: 100%;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #2a2a2a;
          background-color: #141414;
          color: #ffffff;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }
        
        textarea:focus, input[type="email"]:focus {
          outline: none;
          border-color: #e50914;
        }
        
        .email-note {
          font-size: 12px;
          color: #b3b3b3;
          margin-top: 8px;
        }
        
        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background-color: #e50914;
          color: #ffffff;
          border: none;
          padding: 14px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .submit-button:hover:not(:disabled) {
          background-color: #f40612;
        }
        
        .submit-button:disabled {
          background-color: #5c5c5c;
          cursor: not-allowed;
        }
        
        .submit-button svg {
          margin-right: 8px;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .success-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 16px;
        }
        
        .success-message svg {
          margin-bottom: 16px;
        }
        
        .success-message h3 {
          font-size: 20px;
          margin-bottom: 8px;
          color: #ffffff;
        }
        
        .success-message p {
          color: #b3b3b3;
          font-size: 14px;
          max-width: 400px;
        }
        
        /* Mobile adjustments */
        @media (max-width: 576px) {
          .feedback-form {
            padding: 16px;
            border-radius: 0;
            box-shadow: none;
          }
          
          .feedback-types {
            gap: 8px;
          }
          
          .type-button {
            padding: 12px;
            min-width: 80px;
          }
          
          .type-button svg {
            width: 16px;
            height: 16px;
          }
          
          .star-button svg {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default FeedbackForm;
