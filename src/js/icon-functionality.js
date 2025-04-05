/**
 * CourseFlixAI - Icon Functionality
 * This script adds interactivity to all icons and buttons on the CourseFlixAI website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Navigation menu icons
  setupNavigation();
  
  // Action buttons
  setupActionButtons();
  
  // Section links
  setupSectionLinks();
  
  // Search and profile icons
  setupHeaderIcons();
});

/**
 * Set up navigation menu functionality
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll('nav a, .nav a, header a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Get the text content of the link
      const linkText = this.textContent.trim();
      
      // For now, just show an alert (this would be replaced with actual navigation)
      if (linkText === 'Home') {
        // Allow home to work normally
        return;
      } else {
        e.preventDefault();
        alert(`Navigating to ${linkText} section`);
      }
    });
  });
}

/**
 * Set up action buttons (Start Learning, + My List, etc.)
 */
function setupActionButtons() {
  // Start Learning button
  const startLearningBtn = document.querySelector('button:contains("Start Learning")') || 
                          document.querySelector('.start-learning') ||
                          document.querySelector('button[class*="start"]');
  
  if (startLearningBtn) {
    startLearningBtn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Starting course: Machine Learning A-Z™');
    });
  }
  
  // Add to My List button
  const addToListBtn = document.querySelector('button:contains("+ My List")') ||
                      document.querySelector('.add-to-list') ||
                      document.querySelector('button[class*="list"]');
  
  if (addToListBtn) {
    addToListBtn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Added to My List: Machine Learning A-Z™');
      // Toggle button text/appearance to show it's been added
      this.textContent = '✓ In My List';
      this.style.backgroundColor = '#1f1f1f';
      this.style.borderColor = '#1f1f1f';
    });
  }
}

/**
 * Set up section links (See All, etc.)
 */
function setupSectionLinks() {
  const seeAllLinks = document.querySelectorAll('a:contains("See All")') ||
                     document.querySelectorAll('.see-all');
  
  seeAllLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Find the section title by looking at previous heading
      let sectionTitle = 'this section';
      let currentElement = this;
      
      while (currentElement.previousElementSibling) {
        currentElement = currentElement.previousElementSibling;
        if (currentElement.tagName === 'H2' || currentElement.tagName === 'H3') {
          sectionTitle = currentElement.textContent.trim();
          break;
        }
      }
      
      alert(`Viewing all courses in ${sectionTitle}`);
    });
  });
}

/**
 * Set up header icons (search, profile, etc.)
 */
function setupHeaderIcons() {
  // Search icon
  const searchIcon = document.querySelector('.search-icon') || 
                    document.querySelector('header svg[class*="search"]') ||
                    document.querySelector('header i[class*="search"]') ||
                    document.querySelector('header img[alt*="search" i]');
  
  if (searchIcon) {
    searchIcon.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Opening search...');
      // Here you would normally show a search input
    });
  }
  
  // Profile icon
  const profileIcon = document.querySelector('.profile-icon') || 
                     document.querySelector('header svg[class*="profile"]') ||
                     document.querySelector('header i[class*="profile"]') ||
                     document.querySelector('header img[alt*="profile" i]') ||
                     document.querySelector('header .user-icon');
  
  if (profileIcon) {
    profileIcon.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Opening user profile menu...');
      // Here you would normally show a dropdown menu
    });
  }
}

/**
 * Helper function to find elements by text content
 * This is needed because querySelector doesn't support :contains
 */
Document.prototype.querySelector = (function(querySelector) {
  return function(selector) {
    if (selector.includes(':contains(')) {
      const match = selector.match(/:contains\(["']([^"']*)["']\)/);
      if (match) {
        const text = match[1];
        const cleanSelector = selector.replace(/:contains\(["'][^"']*["']\)/, '');
        const elements = Array.from(this.querySelectorAll(cleanSelector || '*'));
        return elements.find(el => el.textContent.includes(text)) || null;
      }
    }
    return querySelector.call(this, selector);
  };
})(Document.prototype.querySelector);

/**
 * Helper function to find all elements by text content
 * This is needed because querySelectorAll doesn't support :contains
 */
Document.prototype.querySelectorAll = (function(querySelectorAll) {
  return function(selector) {
    if (selector.includes(':contains(')) {
      const match = selector.match(/:contains\(["']([^"']*)["']\)/);
      if (match) {
        const text = match[1];
        const cleanSelector = selector.replace(/:contains\(["'][^"']*["']\)/, '');
        const elements = Array.from(this.querySelectorAll(cleanSelector || '*'));
        return elements.filter(el => el.textContent.includes(text));
      }
    }
    return querySelectorAll.call(this, selector);
  };
})(Document.prototype.querySelectorAll);

/**
 * Add hover effects to course cards
 */
function setupCourseCards() {
  const courseCards = document.querySelectorAll('.course-card') || 
                     document.querySelectorAll('img[alt*="Course"]').map(img => img.parentElement);
  
  courseCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'transform 0.3s ease';
      this.style.zIndex = '1';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.zIndex = '0';
    });
    
    card.addEventListener('click', function() {
      // Get course title if available
      let courseTitle = 'this course';
      const titleElement = this.querySelector('h3') || this.querySelector('h4') || this.querySelector('strong');
      if (titleElement) {
        courseTitle = titleElement.textContent.trim();
      }
      
      alert(`Opening course details: ${courseTitle}`);
    });
  });
}

// Call this function as well
setupCourseCards();
