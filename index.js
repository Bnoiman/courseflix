// CourseFlixAI Mobile Responsive Frontend - HomePage Component
import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import HeroBanner from '../components/HeroBanner';
import CourseRow from '../components/CourseRow';

/**
 * HomePage component for CourseFlixAI
 * Main landing page with hero banner and course rows
 */
const HomePage = () => {
  // Sample featured course for hero banner
  const featuredCourse = {
    id: 'featured-course-1',
    title: 'Complete Web Development Bootcamp 2025',
    description: 'Master full-stack web development with this comprehensive bootcamp. Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to build modern, responsive web applications from scratch.',
    provider: 'Tech Academy Pro',
    thumbnail: '/images/featured-course-banner.jpg',
    rating: 4.9,
    level: 'All Levels',
    duration: '60 hours',
    category: 'Web Development',
    tags: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB']
  };
  
  // Sample course data for rows
  const personalizedCourses = [
    {
      id: 'course-1',
      title: 'Python for Data Science and Machine Learning',
      provider: 'DataTech Institute',
      thumbnail: '/images/course-python-ds.jpg',
      rating: 4.8,
      level: 'Intermediate',
      duration: '42 hours',
      category: 'Data Science'
    },
    {
      id: 'course-2',
      title: 'React Native: Build Mobile Apps',
      provider: 'App Academy',
      thumbnail: '/images/course-react-native.jpg',
      rating: 4.7,
      level: 'Intermediate',
      duration: '38 hours',
      category: 'Mobile Development'
    },
    // More courses...
  ];
  
  const trendingCourses = [
    {
      id: 'course-3',
      title: 'UI/UX Design Fundamentals',
      provider: 'Design School',
      thumbnail: '/images/course-uiux.jpg',
      rating: 4.9,
      level: 'Beginner',
      duration: '28 hours',
      category: 'Design'
    },
    {
      id: 'course-4',
      title: 'AWS Certified Solutions Architect',
      provider: 'Cloud Masters',
      thumbnail: '/images/course-aws.jpg',
      rating: 4.8,
      level: 'Advanced',
      duration: '52 hours',
      category: 'Cloud Computing'
    },
    // More courses...
  ];
  
  const continueLearningCourses = [
    {
      id: 'course-5',
      title: 'JavaScript: The Complete Guide',
      provider: 'Coding Experts',
      thumbnail: '/images/course-javascript.jpg',
      rating: 4.7,
      level: 'Beginner to Advanced',
      duration: '48 hours',
      category: 'Programming',
      progress: 65
    },
    {
      id: 'course-6',
      title: 'Digital Marketing Masterclass',
      provider: 'Marketing Pro',
      thumbnail: '/images/course-marketing.jpg',
      rating: 4.6,
      level: 'Intermediate',
      duration: '32 hours',
      category: 'Marketing',
      progress: 30
    },
    // More courses...
  ];
  
  const aiRecommendedCourses = [
    {
      id: 'course-7',
      title: 'Deep Learning Specialization',
      provider: 'AI Academy',
      thumbnail: '/images/course-deep-learning.jpg',
      rating: 4.9,
      level: 'Advanced',
      duration: '56 hours',
      category: 'Artificial Intelligence'
    },
    {
      id: 'course-8',
      title: 'Flutter App Development',
      provider: 'Mobile Dev School',
      thumbnail: '/images/course-flutter.jpg',
      rating: 4.7,
      level: 'Intermediate',
      duration: '36 hours',
      category: 'Mobile Development'
    },
    // More courses...
  ];
  
  const popularCategories = [
    {
      id: 'category-1',
      title: 'Web Development',
      provider: '450+ Courses',
      thumbnail: '/images/category-web-dev.jpg',
      rating: 4.8,
      level: 'All Levels',
      category: 'Programming'
    },
    {
      id: 'category-2',
      title: 'Data Science',
      provider: '320+ Courses',
      thumbnail: '/images/category-data-science.jpg',
      rating: 4.7,
      level: 'All Levels',
      category: 'Data'
    },
    // More categories...
  ];
  
  return (
    <Layout title="CourseFlixAI - Discover Your Learning Path">
      <Head>
        <meta name="description" content="Discover your perfect learning path with CourseFlixAI - AI-powered course recommendations tailored to your interests and goals." />
      </Head>
      
      <HeroBanner course={featuredCourse} />
      
      <div className="home-content">
        {continueLearningCourses.length > 0 && (
          <CourseRow 
            title="Continue Learning" 
            courses={continueLearningCourses} 
          />
        )}
        
        <CourseRow 
          title="Recommended for You" 
          courses={personalizedCourses} 
        />
        
        <CourseRow 
          title="Trending Now" 
          courses={trendingCourses} 
        />
        
        <CourseRow 
          title="Because You Showed Interest in AI" 
          courses={aiRecommendedCourses} 
        />
        
        <CourseRow 
          title="Popular Categories" 
          courses={popularCategories} 
        />
      </div>
      
      <style jsx>{`
        .home-content {
          padding-top: 20px;
        }
        
        /* Mobile adjustments */
        @media (max-width: 767px) {
          .home-content {
            padding-top: 10px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;
