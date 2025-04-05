// CourseFlixAI - Prototype Sharing Component
import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import prototypeConfig from '../../prototype.config';

/**
 * SharePrototype component for CourseFlixAI
 * Provides easy sharing options for the prototype
 */
const SharePrototype = () => {
  const [activeTab, setActiveTab] = useState('link');
  const [copied, setCopied] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const emailInputRef = useRef(null);
  
  const { shareableUrl, qrCodeEnabled } = prototypeConfig.prototype;
  const { methods, defaultMessage, platforms } = prototypeConfig.sharing;
  
  // Handle copy link success
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle email share
  const handleEmailShare = (e) => {
    e.preventDefault();
    const email = emailInputRef.current.value;
    if (!email) return;
    
    // In a real implementation, this would send an API request
    // For the prototype, we'll just show a success message
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 3000);
    emailInputRef.current.value = '';
  };
  
  // Handle social media share
  const handleSocialShare = (platform) => {
    let shareUrl;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(defaultMessage)}&url=${encodeURIComponent(shareableUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}&quote=${encodeURIComponent(defaultMessage)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${defaultMessage} ${shareableUrl}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  return (
    <div className="share-prototype">
      <div className="share-header">
        <h2>Share Prototype</h2>
        <p>Share this prototype with friends to get quick feedback</p>
      </div>
      
      <div className="share-tabs">
        {methods.includes('link') && (
          <button 
            className={`tab-button ${activeTab === 'link' ? 'active' : ''}`}
            onClick={() => setActiveTab('link')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
            </svg>
            <span>Link</span>
          </button>
        )}
        
        {methods.includes('email') && (
          <button 
            className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span>Email</span>
          </button>
        )}
        
        {methods.includes('qr_code') && qrCodeEnabled && (
          <button 
            className={`tab-button ${activeTab === 'qr_code' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr_code')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v2h2v-2zm0 4h-2v2h2v-2zm-4-2h-2v6h6v-2h-4v-4z" />
            </svg>
            <span>QR Code</span>
          </button>
        )}
        
        {methods.includes('social_media') && (
          <button 
            className={`tab-button ${activeTab === 'social_media' ? 'active' : ''}`}
            onClick={() => setActiveTab('social_media')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
            <span>Social</span>
          </button>
        )}
      </div>
      
      <div className="share-content">
        {activeTab === 'link' && (
          <div className="share-link">
            <div className="link-container">
              <input 
                type="text" 
                value={shareableUrl} 
                readOnly 
                className="link-input"
              />
              <CopyToClipboard text={shareableUrl} onCopy={handleCopy}>
                <button className="copy-button">
                  {copied ? (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                  )}
                </button>
              </CopyToClipboard>
            </div>
            <p className="copy-message">{copied ? 'Link copied to clipboard!' : 'Click to copy the link'}</p>
          </div>
        )}
        
        {activeTab === 'email' && (
          <div className="share-email">
            <form onSubmit={handleEmailShare}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="friend@example.com" 
                  ref={emailInputRef}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea 
                  id="message" 
                  rows="3" 
                  defaultValue={defaultMessage}
                ></textarea>
              </div>
              <button type="submit" className="send-button">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <span>Send Invitation</span>
              </button>
              {showShareSuccess && (
                <div className="success-message">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span>Invitation sent successfully!</span>
                </div>
              )}
            </form>
          </div>
        )}
        
        {activeTab === 'qr_code' && (
          <div className="share-qr-code">
            <div className="qr-container">
              <QRCode 
                value={shareableUrl} 
                size={200}
                level="H"
                includeMargin={true}
                renderAs="svg"
                bgColor="#1a1a1a"
                fgColor="#ffffff"
                imageSettings={{
                  src: "/images/courseflix-logo-small.png",
                  x: null,
                  y: null,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            <p className="qr-instructions">Scan this QR code with a mobile device to open the prototype</p>
            <button className="download-button">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              <span>Download QR Code</span>
            </button>
          </div>
        )}
        
        {activeTab === 'social_media' && (
          <div className="share-social">
            <p className="social-instructions">Share the prototype on social media</p>
            <div className="social-buttons">
              {platforms.includes('twitter') && (
                <button 
                  className="social-button twitter"
                  onClick={() => handleSocialShare('twitter')}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                  <span>Twitter</span>
                </button>
              )}
              
              {platforms.includes('facebook') && (
                <button 
                  className="social-button facebook"
                  onClick={() => handleSocialShare('facebook')}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                  </svg>
                  <span>Facebook</span>
                </button>
              )}
              
              {platforms.includes('linkedin') && (
                <button 
                  className="social-button linkedin"
                  onClick={() => handleSocialShare('linkedin')}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>LinkedIn</span>
                </button>
              )}
              
              {platforms.includes('whatsapp') && (
                <button 
                  className="social-button whatsapp"
                  onClick={() => handleSocialShare('whatsapp')}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
                  </svg>
                  <span>WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="feedback-link">
        <a href={prototypeConfig.prototype.feedbackFormUrl} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
          </svg>
          <span>Submit Feedback</span>
        </a>
      </div>
      
      <style jsx>{`
        .share-prototype {
          background-color: #1a1a1a;
          border-radius: 8px;
          padding: 24px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
        
        .share-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .share-header h2 {
          font-size: 24px;
          margin-bottom: 8px;
          color: #ffffff;
        }
        
        .share-header p {
          color: #b3b3b3;
          font-size: 14px;
        }
        
        .share-tabs {
          display: flex;
          border-bottom: 1px solid #2a2a2a;
          margin-bottom: 24px;
        }
        
        .tab-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: none;
          border: none;
          color: #b3b3b3;
          padding: 12px;
          cursor: pointer;
          flex: 1;
          transition: all 0.2s ease;
        }
        
        .tab-button svg {
          margin-bottom: 8px;
        }
        
        .tab-button span {
          font-size: 12px;
        }
        
        .tab-button.active {
          color: #e50914;
          border-bottom: 2px solid #e50914;
        }
        
        .tab-button:hover {
          color: #ffffff;
        }
        
        .share-content {
          margin-bottom: 24px;
        }
        
        /* Link tab styles */
        .share-link {
          display: flex;
          flex-direction: column;
        }
        
        .link-container {
          display: flex;
          margin-bottom: 8px;
        }
        
        .link-input {
          flex: 1;
          padding: 12px;
          border-radius: 4px 0 0 4px;
          border: 1px solid #2a2a2a;
          background-color: #141414;
          color: #ffffff;
          font-size: 14px;
        }
        
        .copy-button {
          background-color: #2a2a2a;
          border: none;
          color: #ffffff;
          padding: 0 16px;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .copy-button:hover {
          background-color: #3a3a3a;
        }
        
        .copy-message {
          font-size: 12px;
          color: #b3b3b3;
          text-align: center;
        }
        
        /* Email tab styles */
        .share-email form {
          display: flex;
          flex-direction: column;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #e5e5e5;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #2a2a2a;
          background-color: #141414;
          color: #ffffff;
          font-size: 14px;
          font-family: inherit;
        }
        
        .send-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e50914;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .send-button svg {
          margin-right: 8px;
        }
        
        .send-button:hover {
          background-color: #f40612;
        }
        
        .success-message {
          display: flex;
          align-items: center;
          margin-top: 16px;
          padding: 12px;
          background-color: rgba(76, 175, 80, 0.1);
          border-radius: 4px;
          color: #4caf50;
        }
        
        .success-message svg {
          margin-right: 8px;
        }
        
        /* QR Code tab styles */
        .share-qr-code {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .qr-container {
          background-color: #ffffff;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .qr-instructions {
          font-size: 14px;
          color: #b3b3b3;
          text-align: center;
          margin-bottom: 16px;
        }
        
        .download-button {
          display: flex;
          align-items: center;
          background-color: #2a2a2a;
          color: #ffffff;
          border: none;
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .download-button svg {
          margin-right: 8px;
        }
        
        .download-button:hover {
          background-color: #3a3a3a;
        }
        
        /* Social media tab styles */
        .share-social {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .social-instructions {
          font-size: 14px;
          color: #b3b3b3;
          text-align: center;
          margin-bottom: 16px;
        }
        
        .social-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }
        
        .social-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: none;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 16px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100px;
        }
        
        .social-button svg {
          margin-bottom: 8px;
        }
        
        .social-button span {
          font-size: 12px;
        }
        
        .social-button.twitter:hover {
          background-color: rgba(29, 161, 242, 0.1);
          border-color: #1da1f2;
          color: #1da1f2;
        }
        
        .social-button.facebook:hover {
          background-color: rgba(66, 103, 178, 0.1);
          border-color: #4267b2;
          color: #4267b2;
        }
        
        .social-button.linkedin:hover {
          background-color: rgba(0, 119, 181, 0.1);
          border-color: #0077b5;
          color: #0077b5;
        }
        
        .social-button.whatsapp:hover {
          background-color: rgba(37, 211, 102, 0.1);
          border-color: #25d366;
          color: #25d366;
        }
        
        /* Feedback link */
        .feedback-link {
          text-align: center;
        }
        
        .feedback-link a {
          display: inline-flex;
          align-items: center;
          color: #e50914;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .feedback-link a svg {
          margin-right: 8px;
        }
        
        .feedback-link a:hover {
          color: #f40612;
          text-decoration: underline;
        }
        
        /* Mobile adjustments */
        @media (max-width: 576px) {
          .share-prototype {
            padding: 16px;
            border-radius: 0;
            box-shadow: none;
          }
          
          .tab-button {
            padding: 8px;
          }
          
          .social-buttons {
            gap: 8px;
          }
          
          .social-button {
            width: 80px;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SharePrototype;
