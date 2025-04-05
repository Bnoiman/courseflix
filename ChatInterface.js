// CourseFlixAI Mobile Responsive Frontend - Chat Interface Component
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

/**
 * Chat Interface component for CourseFlixAI
 * Provides AI conversation functionality with responsive design
 */
const ChatInterface = ({ isOpen, isMobile, closeChat }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      content: "Hi there! I'm Flex, your personal learning assistant. What would you like to learn today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle click outside to close chat on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && chatRef.current && !chatRef.current.contains(event.target)) {
        closeChat();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isOpen, closeChat]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate API call to get AI response
    // In production, this would call the actual conversation API
    setTimeout(() => {
      let response;
      
      // Simple response logic based on user input
      const lowerInput = inputValue.toLowerCase();
      
      if (lowerInput.includes('python') || lowerInput.includes('programming')) {
        response = {
          id: messages.length + 2,
          role: 'assistant',
          content: "I found some great Python programming courses for you! Here are my top recommendations:\n\n1. **Python for Data Science and Machine Learning Bootcamp**\n   Perfect for beginners who want to learn Python for data analysis\n\n2. **Complete Python Developer in 2025**\n   A comprehensive course covering Python fundamentals to advanced topics\n\n3. **Automate the Boring Stuff with Python**\n   Learn practical Python skills for everyday tasks\n\nWould you like more information about any of these courses?",
          timestamp: new Date().toISOString()
        };
      } else if (lowerInput.includes('design') || lowerInput.includes('ui') || lowerInput.includes('ux')) {
        response = {
          id: messages.length + 2,
          role: 'assistant',
          content: "I found some excellent design courses for you! Here are my top recommendations:\n\n1. **UI/UX Design Fundamentals**\n   Learn the principles of user interface and experience design\n\n2. **Web Design for Beginners: Real World Coding in HTML & CSS**\n   Perfect for starting your journey in web design\n\n3. **Adobe XD: UI/UX Design from Scratch**\n   Master the industry-standard tool for UI/UX design\n\nWould you like more details about any of these courses?",
          timestamp: new Date().toISOString()
        };
      } else if (lowerInput.includes('beginner') || lowerInput.includes('start')) {
        response = {
          id: messages.length + 2,
          role: 'assistant',
          content: "Looking for beginner-friendly courses? I've got you covered! Here are some great options to start your learning journey:\n\n1. **Web Development Bootcamp**\n   A comprehensive introduction to HTML, CSS, and JavaScript\n\n2. **Data Science Fundamentals**\n   Learn the basics of data analysis and visualization\n\n3. **Digital Marketing Essentials**\n   Master the fundamentals of online marketing\n\nAll of these are perfect for beginners with no prior experience. Which area interests you most?",
          timestamp: new Date().toISOString()
        };
      } else {
        response = {
          id: messages.length + 2,
          role: 'assistant',
          content: "Thanks for sharing your interests! Based on what you've told me, I can recommend some courses that might be perfect for you. Could you tell me a bit more about your experience level and what specific skills you're hoping to learn?",
          timestamp: new Date().toISOString()
        };
      }
      
      setMessages(prevMessages => [...prevMessages, response]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle input submission on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format timestamp for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div 
      ref={chatRef}
      className={`chat-interface ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}
    >
      <div className="chat-header">
        <div className="chat-title">
          <div className="assistant-avatar">
            <Image 
              src="/images/ai-assistant-avatar.png" 
              alt="AI Assistant" 
              width={32} 
              height={32} 
            />
          </div>
          <div>
            <h3>Course Advisor</h3>
            <span className="status online">Online</span>
          </div>
        </div>
        
        <button 
          className="close-button" 
          onClick={closeChat}
          aria-label="Close chat"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.role === 'assistant' ? 'assistant' : 'user'}`}
          >
            {message.role === 'assistant' && (
              <div className="message-avatar">
                <Image 
                  src="/images/ai-assistant-avatar.png" 
                  alt="AI Assistant" 
                  width={32} 
                  height={32} 
                />
              </div>
            )}
            <div className="message-content">
              <div className="message-bubble">
                {message.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message assistant">
            <div className="message-avatar">
              <Image 
                src="/images/ai-assistant-avatar.png" 
                alt="AI Assistant" 
                width={32} 
                height={32} 
              />
            </div>
            <div className="message-content">
              <div className="message-bubble typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          aria-label="Chat message input"
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
      
      <style jsx>{`
        .chat-interface {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 320px;
          background-color: #141414;
          color: #e5e5e5;
          display: flex;
          flex-direction: column;
          z-index: 1001;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        
        .chat-interface.open {
          transform: translateX(0);
        }
        
        .chat-interface.mobile {
          width: 100%;
          max-width: 100%;
        }
        
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          border-bottom: 1px solid #2a2a2a;
          background-color: #1a1a1a;
        }
        
        .chat-title {
          display: flex;
          align-items: center;
        }
        
        .assistant-avatar {
          margin-right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #e50914;
        }
        
        .chat-title h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .status {
          font-size: 12px;
          color: #b3b3b3;
        }
        
        .status.online::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #4CAF50;
          border-radius: 50%;
          margin-right: 5px;
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
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
        }
        
        .message {
          display: flex;
          margin-bottom: 15px;
          align-items: flex-start;
        }
        
        .message.user {
          flex-direction: row-reverse;
        }
        
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .message.user .message-avatar {
          margin-right: 0;
          margin-left: 10px;
        }
        
        .message-content {
          display: flex;
          flex-direction: column;
          max-width: 80%;
        }
        
        .message.user .message-content {
          align-items: flex-end;
        }
        
        .message-bubble {
          padding: 10px 15px;
          border-radius: 18px;
          background-color: #2a2a2a;
          color: #ffffff;
          font-size: 14px;
          line-height: 1.4;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .message.user .message-bubble {
          background-color: #e50914;
        }
        
        .message-time {
          font-size: 11px;
          color: #b3b3b3;
          margin-top: 5px;
        }
        
        .typing {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 50px;
          min-height: 30px;
        }
        
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #b3b3b3;
          margin: 0 2px;
          animation: typing 1.4s infinite ease-in-out both;
        }
        
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        .chat-input {
          display: flex;
          align-items: center;
          padding: 15px;
          border-top: 1px solid #2a2a2a;
          background-color: #1a1a1a;
        }
        
        .chat-input textarea {
          flex: 1;
          border: none;
          background-color: #2a2a2a;
          color: #ffffff;
          padding: 10px 15px;
          border-radius: 20px;
          resize: none;
          font-size: 14px;
          outline: none;
          max-height: 100px;
          font-family: inherit;
        }
        
        .chat-input textarea::placeholder {
          color: #b3b3b3;
        }
        
        .chat-input button {
          background: none;
          border: none;
          color: #e50914;
          cursor: pointer;
          padding: 10px;
          margin-left: 10px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        
        .chat-input button:hover {
          background-color: rgba(229, 9, 20, 0.1);
        }
        
        .chat-input button:disabled {
          color: #b3b3b3;
          cursor: not-allowed;
        }
        
        /* Scrollbar styling */
        .chat-messages::-webkit-scrollbar {
          width: 5px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
          background: #141414;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #3a3a3a;
        }
        
        /* Desktop styles */
        @media (min-width: 768px) {
          .chat-interface {
            top: 70px;
            transform: translateX(100%);
          }
          
          .chat-interface.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
