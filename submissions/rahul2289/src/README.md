# Graph Crafter – Interactive Knowledge Graph Visualizer

**Full Name**: Rahul  
**GitHub Username**: [rahul2289](https://github.com/rahul2289)  
**Email**: burrarahulgoud1999@gmail.com

## 🚀 Description

This is a React-based interactive knowledge graph visualizer built using **Cytoscape.js** and **Tippy.js**. It renders a customizable graph from structured JSON data containing nodes and edges, each with properties and styles. Users can explore entity relationships visually with hover-based tooltips showing metadata.

---

## 🧰 Libraries & Tools Used

- **React** – Frontend framework  
- **Cytoscape.js** – Graph rendering engine  
- **react-cytoscapejs** – React wrapper for Cytoscape  
- **Tippy.js** – Tooltip rendering  
- **CSS** – Styling

---

## 🎨 Design Decisions

- **Graph Shapes**: Different node types (e.g., User, Document, Policy) are assigned unique shapes to make the graph visually informative.
- **Colors & Styling**: Each node/edge can carry its own color and style via the `sample.json`, offering flexibility for domain-specific visuals.
- **Tooltips with Tippy.js**: Instead of using `cytoscape-popper`, tooltips are handled directly via Tippy with manual DOM refs to avoid runtime issues and improve compatibility.
- **Responsive Layout**: Graph takes full viewport height and adapts its layout with padding and animation.

---

## 📂 Folder Structure

```
└── 📁src
    └── 📁assets
        └── react.svg
    └── App.css
    └── App.jsx
    └── index.css
    └── main.jsx
```

## 🔗 Deployed Link

[Live Demo on Netlify](https://graphcrafter.netlify.app/)