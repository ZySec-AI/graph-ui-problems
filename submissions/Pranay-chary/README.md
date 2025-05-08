# Graph Crafter

## Developer Information
- **Full Name**: PRANAY KUMAR INDRAKANTI
- **GitHub**: Pranay-chary
- **Email**: pranay2004indrakanti@gmail.com

## Project Overview
A modern, interactive graph visualization tool built for the ZySec AI Hackathon. This application visualizes knowledge graphs with nodes, edges, and their relationships in an intuitive and interactive way.

## Design Decisions

1. **Component Architecture**
   - Modular design with separate components for Graph, Analytics, and Settings
   - React Flow integration for robust graph visualization
   - Custom node and edge components for enhanced visualization

2. **State Management**
   - Local state management using React hooks
   - Centralized data flow through App component
   - Real-time graph updates with automatic layout

3. **User Experience**
   - Dark/Light mode support
   - Responsive design for all screen sizes
   - Interactive tooltips and controls
   - JSON file import functionality
   - Group-based filtering

4. **Performance Optimizations**
   - Memoized graph calculations
   - Efficient node and edge rendering
   - Smooth animations and transitions
   - Lazy loading of components

## Libraries and Tools

### Core
- React 18
- TypeScript 5
- Vite
- React Flow

### Styling
- Tailwind CSS
- PostCSS
- Autoprefixer

### Development
- ESLint
- Prettier
- Vitest
- React Testing Library




## Features

- 🎯 Interactive node and edge visualization
- 🖱️ Pan and zoom functionality
- 📌 Node labels and types
- 🔄 Directional edges with arrows
- 🧠 Tooltips showing node properties
- 🎨 Customizable styles for nodes and edges
- 🧱 Group-based organization

## Tech Stack

- React + TypeScript
- React Flow for graph visualization
- Tailwind CSS for styling
- Vite for build tooling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown in the terminal

## Usage

The application accepts a JSON file with the following structure:

```json
{
  "meta": {
    "title": "Graph Title",
    "description": "Graph Description"
  },
  "nodes": [
    {
      "id": "node1",
      "label": "Node Label",
      "type": "Node Type",
      "properties": {
        "key": "value"
      },
      "style": {
        "color": "color-code",
        "shape": "shape-type"
      },
      "group": "Group Name"
    }
  ],
  "edges": [
    {
      "source": "source-node-id",
      "target": "target-node-id",
      "label": "Edge Label",
      "direction": "->",
      "style": {
        "lineType": "solid|dashed|dotted",
        "color": "color-code"
      }
    }
  ]
}
```


