// CourseFlixAI Mobile Responsive Frontend - _app.js
import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';

/**
 * Custom App component for CourseFlixAI
 * Provides global configuration and styles
 */
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#141414" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>CourseFlixAI - Discover Your Learning Path</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
