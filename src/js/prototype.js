// CourseFlixAI - Prototype Page
import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import SharePrototype from '../components/SharePrototype';
import FeedbackForm from '../components/FeedbackForm';
import prototypeConfig from '../../prototype.config';

/**
 * PrototypePage component for CourseFlixAI
 * Provides sharing and feedback options for the prototype
 */
const PrototypePage = () => {
  return (
    <Layout title="CourseFlixAI - Prototype Sharing">
      <Head>
        <meta name="description" content="Share the CourseFlixAI prototype with friends and provide feedback." />
      </Head>
      
      <div className="prototype-page">
        <div className="prototype-header">
          <h1>CourseFlixAI Prototype</h1>
          <p>Thank you for testing our prototype! Share it with friends or provide feedback below.</p>
        </div>
        
        <div className="prototype-info">
          <div className="info-card">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <h3>About This Prototype</h3>
            <p>This is a prototype version of CourseFlixAI, a Netflix-style learning platform with AI-powered course recommendations. Some features may be limited or simulated.</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
            <h3>Demo Credentials</h3>
            <p>Use the following credentials to explore all features:</p>
            <div className="credentials">
              <div className="credential-item">
                <span>Email:</span>
                <code>{prototypeConfig.prototype.demoCredentials.email}</code>
              </div>
              <div className="credential-item">
                <span>Password:</span>
                <code>{prototypeConfig.prototype.demoCredentials.password}</code>
              </div>
            </div>
          </div>
        </div>
        
        <div className="prototype-sections">
          <section className="prototype-section">
            <h2>Share Prototype</h2>
            <SharePrototype />
          </section>
          
          <section className="prototype-section">
            <h2>Provide Feedback</h2>
            <FeedbackForm />
          </section>
        </div>
      </div>
      
      <style jsx>{`
        .prototype-page {
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .prototype-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .prototype-header h1 {
          font-size: 36px;
          margin-bottom: 16px;
          color: #ffffff;
        }
        
        .prototype-header p {
          font-size: 18px;
          color: #b3b3b3;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .prototype-info {
          display: flex;
          gap: 24px;
          margin-bottom: 40px;
        }
        
        .info-card {
          flex: 1;
          background-color: #1a1a1a;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        
        .info-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: rgba(229, 9, 20, 0.1);
          color: #e50914;
          margin-bottom: 16px;
        }
        
        .info-card h3 {
          font-size: 20px;
          margin-bottom: 12px;
          color: #ffffff;
        }
        
        .info-card p {
          font-size: 14px;
          color: #b3b3b3;
          margin-bottom: 16px;
        }
        
        .credentials {
          background-color: #141414;
          border-radius: 4px;
          padding: 16px;
        }
        
        .credential-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .credential-item:last-child {
          margin-bottom: 0;
        }
        
        .credential-item span {
          color: #e5e5e5;
        }
        
        .credential-item code {
          font-family: monospace;
          color: #e50914;
          background-color: rgba(229, 9, 20, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .prototype-sections {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .prototype-section h2 {
          font-size: 24px;
          margin-bottom: 24px;
          color: #ffffff;
          text-align: center;
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
          .prototype-page {
            padding: 20px 16px;
          }
          
          .prototype-header h1 {
            font-size: 28px;
          }
          
          .prototype-header p {
            font-size: 16px;
          }
          
          .prototype-info {
            flex-direction: column;
          }
          
          .prototype-section h2 {
            font-size: 22px;
            margin-bottom: 16px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default PrototypePage;
