# Interactive Graph Visualizer

## Author Information
- **Full Name:** Shubham Kumar Mandal
- **GitHub Username:** shubhampr07
- **Email:** shubhampaul756@gmail.com

## Deployed Link 
"https://graphy-ui.netlify.app/"

## Project Overview
An interactive graph visualization tool that allows users to visualize and explore complex network relationships through an intuitive interface. The application supports dynamic graph rendering, search functionality, and both light and dark themes for optimal viewing experience.

## Libraries/Tools Used
- **Core Technologies:**
  - React with TypeScript
  - Vite (Build tool)
  - TailwindCSS (Styling)

- **Graph Visualization:**
  - React Flow (Graph rendering)
  - Dagre (Graph layout algorithm)

- **State Management:**
  - React Hooks (useState, useEffect, useCallback)
  - Custom Hooks (useDarkMode)

- **Styling & UI:**
  - TailwindCSS (Utility-first CSS)
  - CSS Modules
  - Inter Font Family
  - Custom CSS Variables for theming

## Design Decisions

### 1. Architecture
- **Component-Based Structure:** Modular components for better maintainability and reusability
- **Custom Hooks:** Separated business logic from UI components (e.g., useDarkMode)
- **TypeScript:** Strong typing for better code quality and developer experience

### 2. UI/UX Features
- **Responsive Design:** 
  - Split-view layout for larger screens
  - Collapsible panels for mobile view
  - Adaptive sizing for different screen sizes

- **Dark Mode Support:**
  - System preference detection
  - Manual toggle option
  - Persistent preference storage

- **Interactive Features:**
  - Zoom and pan controls
  - Node selection and highlighting
  - Search functionality
  - Custom node shapes and styles

### 3. Graph Visualization
- **Layout Algorithm:** Implemented Dagre for automatic graph layout
- **Custom Node Types:** Support for different node shapes and styles
- **Edge Styling:** Customizable edge types with animations
- **Performance Optimization:** Efficient rendering with React Flow

### 4. Data Handling
- **JSON Input Support:**
  - Direct JSON text input
  - File upload capability
  - Sample data loading
  - JSON validation and error handling

## How to Run the Project
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173 in your browser

## Features
- Interactive graph visualization
- Dark/Light theme support
- JSON data input (text/file)
- Search functionality
- Zoom/Pan controls
- Node selection and highlighting
- Responsive design
- Custom node shapes and styles
- Automatic layout
- MiniMap for navigation

## Additional Information
The project uses modern React practices and follows a component-based architecture. It's built with scalability in mind and can handle complex graph structures. The UI is designed to be intuitive and user-friendly, with careful attention to accessibility and user experience.
