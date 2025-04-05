# Netflix-Style UI Design for Class Central

## Color Palette

### Primary Colors
- Background: #141414 (Netflix dark)
- Primary Accent: #E50914 (Netflix red)
- Secondary Accent: #0071EB (Blue for education focus)
- Text Primary: #FFFFFF
- Text Secondary: #B3B3B3

### Category Colors
- Programming: #7B68EE (Slate blue)
- Business: #00CED1 (Turquoise)
- Data Science: #32CD32 (Lime green)
- Design: #FF8C00 (Dark orange)
- Personal Development: #FF1493 (Deep pink)

## Typography

- Primary Font: 'Netflix Sans', Helvetica, Arial, sans-serif
- Headings: 
  - H1: 32px/40px, 700 weight
  - H2: 24px/32px, 700 weight
  - H3: 18px/24px, 500 weight
- Body: 16px/24px, 400 weight
- Small Text: 14px/20px, 400 weight
- Button Text: 16px, 500 weight, uppercase

## Component Designs

### Navigation Bar
- Fixed position at top
- Semi-transparent black background (rgba(20, 20, 20, 0.8))
- Becomes solid on scroll
- Left: Logo
- Center: Primary navigation links
- Right: Search, User profile, Notifications

### Hero Banner
- Full-width, 60vh height
- Gradient overlay for text readability
- Large course title (H1)
- Brief description (max 2 lines)
- Provider logo/name
- Rating stars
- "Start Learning" button (Primary red)
- "Add to My List" button (Secondary)
- Auto-rotating featured courses (5-7 second intervals)

### Category Rows
- Row title with "See All" link
- Horizontally scrollable cards
- Left/right navigation arrows appear on hover
- 5-6 visible cards per row
- 20px gap between cards
- Subtle row dividers (rgba(255, 255, 255, 0.1))

### Course Cards
- 16:9 aspect ratio thumbnails
- Card dimensions: 300px × 169px (default state)
- Scale to 1.2x on hover with z-index increase
- Shadow effect on hover
- Transition: 0.3s ease-in-out
- Information appears on hover:
  - Course title
  - Provider
  - Rating
  - Duration
  - Level
  - "Add to List" button

### Continue Learning Section
- Prominent placement below hero
- Progress bar on each course card
- "Resume" button
- Last accessed timestamp
- Next module/lesson title

### Recommendation Sections
- "Because you watched [Course Name]"
- "Top Picks for You"
- "Popular in [User's Field of Interest]"
- "New Releases"
- "Trending Now"

### Conversational AI Interface
- Floating action button (bottom right)
- Expands to chat panel (350px width)
- Dark theme matching main UI
- User bubbles in accent color
- AI assistant bubbles in secondary color
- Quick reply chips for common responses
- Typing indicator
- Minimize/maximize controls

### User Profile & Settings
- Netflix-style profile selection on login
- Profile customization with avatars
- Learning preferences section
- Notification settings
- Viewing history
- My List management

## Responsive Behavior

### Mobile (< 768px)
- Stacked layout for course cards (2 per row)
- Hamburger menu for navigation
- Full-width hero banner
- Chat interface expands to full screen

### Tablet (768px - 1024px)
- 3-4 course cards visible per row
- Condensed navigation
- Scaled down hero banner
- Chat interface as slide-up panel

### Desktop (> 1024px)
- 5-6 course cards visible per row
- Full navigation bar
- Immersive hero banner
- Chat interface as side panel

## Animations & Transitions

### Card Hover
- Scale: 1.0 to 1.2
- Shadow: 0px to 10px blur
- Content fade in
- Delay for preview: 800ms

### Page Transitions
- Fade in/out: 300ms
- Content slide up: 400ms
- Staggered loading of rows: 100ms delay between each

### Scrolling
- Smooth scrolling behavior
- Row scroll animation: 400ms ease
- Elastic overscroll effect

### Navigation
- Dropdown menus with fade in/out
- Underline animation for active links
- Search expand/collapse animation

## Interactive Elements

### Video Previews
- Autoplay on card hover after 800ms delay
- Muted by default with option to enable sound
- Quality options based on connection speed
- Preview length: 15-30 seconds

### Search Experience
- Expandable search bar
- Real-time results as you type
- Category filters
- Recent searches saved
- Voice search option

### Personalization Controls
- Thumbs up/down on recommendations
- "Not interested" option
- "More like this" option
- Save to custom lists

## Implementation Notes

### CSS Framework
- Tailwind CSS with custom Netflix-inspired theme
- CSS variables for color scheme
- Dark mode as default

### Component Library
- React components with styled-components or Emotion
- Framer Motion for animations
- Custom hooks for scroll behavior

### Performance Considerations
- Lazy loading for off-screen content
- Image optimization with next-gen formats
- Skeleton screens during loading
- Virtual scrolling for long lists

### Accessibility
- High contrast between text and backgrounds
- Keyboard navigation support
- Screen reader friendly markup
- Focus indicators for interactive elements
- Caption support for video previews
