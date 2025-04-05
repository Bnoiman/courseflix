/**
 * CourseFlixAI - Chat Interface
 * Implements the AI conversation interface for course recommendations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Create chat button if it doesn't exist
  if (!document.querySelector('.chat-button')) {
    const chatButton = document.createElement('div');
    chatButton.className = 'chat-button';
    chatButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
      </svg>
    `;
    document.body.appendChild(chatButton);
  }
  
  // Create chat interface
  const chatInterface = document.createElement('div');
  chatInterface.className = 'chat-interface';
  chatInterface.innerHTML = `
    <div class="chat-header">
      <h3>CourseFlixAI Assistant</h3>
      <button class="close-chat">×</button>
    </div>
    <div class="chat-messages">
      <div class="message ai-message">
        ${getGreeting()}
      </div>
    </div>
    <div class="chat-input">
      <input type="text" placeholder="Ask about courses...">
      <button class="send-message">Send</button>
    </div>
  `;
  
  document.body.appendChild(chatInterface);
  chatInterface.style.display = 'none';
  
  // Get course data
  let courseData = {};
  fetch('data/courses.json')
    .then(response => response.json())
    .then(data => {
      courseData = data;
    })
    .catch(error => {
      console.error('Error loading course data:', error);
    });
  
  // Toggle chat interface
  const chatButton = document.querySelector('.chat-button');
  chatButton.addEventListener('click', function() {
    chatInterface.style.display = chatInterface.style.display === 'none' ? 'flex' : 'none';
  });
  
  // Close chat
  document.querySelector('.close-chat').addEventListener('click', function() {
    chatInterface.style.display = 'none';
  });
  
  // Send message
  const input = document.querySelector('.chat-input input');
  const sendButton = document.querySelector('.send-message');
  
  function sendMessage() {
    const message = input.value.trim();
    if (message) {
      // Add user message
      const messagesContainer = document.querySelector('.chat-messages');
      messagesContainer.innerHTML += `
        <div class="message user-message">
          ${message}
        </div>
      `;
      
      // Process and add AI response
      const response = processUserInput(message);
      
      // Show typing indicator
      messagesContainer.innerHTML += `
        <div class="message ai-message typing-indicator">
          <span></span><span></span><span></span>
        </div>
      `;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // After a short delay, replace typing indicator with response
      setTimeout(() => {
        // Remove typing indicator
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
          typingIndicator.remove();
        }
        
        // Get course details for recommendations
        const recommendedCourses = response.recommendations.map(courseId => {
          const course = courseData.courses.find(c => c.id === courseId) || {
            id: courseId,
            title: courseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            provider: 'Unknown',
            image: `images/courses/${courseId}.jpg`
          };
          return course;
        });
        
        // Add AI response with course recommendations
        messagesContainer.innerHTML += `
          <div class="message ai-message">
            ${response.response}
            <div class="recommendation-courses">
              ${recommendedCourses.map(course => `
                <div class="recommendation-course" data-course-id="${course.id}">
                  <div class="course-image">
                    <img src="${course.image}" alt="${course.title}" onerror="this.src='images/course-placeholder.jpg'">
                  </div>
                  <div class="course-info">
                    <span class="course-title">${course.title}</span>
                    <span class="course-provider">${course.provider}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Make recommended courses clickable
        document.querySelectorAll('.recommendation-course').forEach(course => {
          course.addEventListener('click', function() {
            const courseId = this.dataset.courseId;
            // Find course details
            const courseDetails = courseData.courses.find(c => c.id === courseId);
            if (courseDetails) {
              // Show course details (you could navigate to a course page here)
              alert(`Course: ${courseDetails.title}\nProvider: ${courseDetails.provider}\nRating: ${courseDetails.rating}/5 (${courseDetails.ratingCount.toLocaleString()} ratings)\nLevel: ${courseDetails.level}\nDuration: ${courseDetails.duration}`);
            } else {
              alert(`Course details for ${courseId} not found.`);
            }
          });
        });
      }, 1500);
      
      input.value = '';
    }
  }
  
  sendButton.addEventListener('click', sendMessage);
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});
