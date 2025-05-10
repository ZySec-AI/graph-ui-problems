# Graph Crafter Submission

Full Name: Sonal Kharde
GitHub Username: sonalkgit  
Email: khardesonal18@gmail.com

------------------------------------------------------------------------------------------

### Libraries/Tools Used
| Tool/Library          | Purpose                                   |
|-----------------------|-------------------------------------------|
| **React**             | UI rendering                              |
| **TypeScript**        | Type safety and better developer tooling  |
| **Cytoscape.js**      | Graph rendering and layout engine         |
| **cytoscape-qtip**    | Tooltips on nodes                         |
| **Vite**              | Lightning-fast development build tool     |
| **SCSS**              | Styling                                   |

------------------------------------------------------------------------------------------

## Features Implemented

- **Graph Rendering**: Displays nodes and edges from Graph Json Data.
- **Interactive Nodes**: Hover tooltips showing custom metadata.
- **Node Styling**: Dynamic styles (color, shape, etc.) via props.
- **Responsive Design**: Works on various screen sizes.

-----------------------------------------------------------------------------------------

## Design Decisions

1. **Graph Rendering with Cytoscape.js**  
   - Used the `react-cytoscapejs` wrapper to render a dynamic graph.
   - Registered and applied the `cytoscape-dagre` layout plugin (though currently using a `grid` layout for node arrangement).
   - Graph nodes and edges are dynamically generated from a typed `GraphData` object.

2. **Node and Edge Styling**  
   - Node colors and shapes are customizable via optional `style` properties.
   - Edge styles support solid and dashed lines, directional arrows, and custom colors.

3. **Custom Tooltip on Node Hover**  
   - Built a `Tooltip` component from scratch without using external libraries like `cytoscape-qtip`.
   - Tooltips show non-core metadata from node properties, displayed near the cursor.

4. **Type Safety and Structure**  
   - Defined a custom `GraphData` TypeScript type to ensure consistent structure for nodes, edges, and metadata across the application.

5. **Component Modularity**  
   - The graph and tooltip logic are separated into their own components for clarity and maintainability.

6. **Static Sample Data Usage**  
   - Imported and rendered a sample graph defined in `sample_graph.json` to demonstrate graph structure and rendering capabilities.


-------------------------------------------------------------------------------------------------

### 🌐 Deployed Link (Optional)s
   - https://visionary-brigadeiros-adaf60.netlify.app/
--------------------------------------------------------------------------------------------------

