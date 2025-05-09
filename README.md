Graph Crafter Submission
Full Name: Sharanyo Chatterjee
GitHub Username: sharanyocr7
Email: sharanyo123@gmail.com
Contact: 9674012373

Problem Statement
Build a web-based Graph UI that reads a structured JSON file describing nodes, edges, metadata, and styling — and renders it into an interactive, pannable, zoomable, and understandable graph.

 UI must:

Visualize labeled nodes and edges

Support directional edges and metadata tooltips

Respect styles (e.g., shape, color, dashed lines)

Allow node/edge interactions (hover/click)

Be responsive and user-friendly

Libraries/Tools Used
Cytoscape.js: Core library for graph visualization and interaction.

Tippy.js: Used for creating interactive tooltips on graph elements.

Popper.js: A dependency required by Tippy.js for positioning.

HTML: For the basic page structure.

CSS: For styling the page layout and the graph container.

JavaScript (Vanilla JS): For handling file input, parsing JSON, initializing Cytoscape, and implementing interactive behaviors.

Design Decisions
Visualization Library: Cytoscape.js was chosen for its robust features, performance with interactive graphs, and extensive documentation, making it suitable for rendering complex relational data.

JSON Data Structure: The UI is designed to strictly adhere to the specified JSON structure containing nodes, edges, meta, and styling sections, ensuring flexibility in defining graph content and appearance.

Interactive Features: Panning, zooming, and element selection are handled natively by Cytoscape.js. Hover effects and detailed metadata tooltips (powered by Tippy.js) were implemented using Cytoscape's event API to provide additional information on interaction.

Styling: The implementation respects styling information provided in the JSON (data.style on elements and styling for global defaults). Node shapes and colors are dynamically applied based on data properties like type and group. Edge direction and line styles (solid, dashed/dotted) are also derived from the edge data.

Layout Handling: The application is configured to use core Cytoscape.js layouts (such as grid, cose, circle, etc.) by default or as specified in the JSON's styling.layout.name. Logic was included to bypass potential issues with external layout extensions like cose-bilkent by defaulting to a reliable core layout if the preferred one is not available. Default layout parameters are set to encourage a more spread-out graph appearance.

Responsiveness and Container: The graph container (#graph-container) is styled with a percentage width and a fixed height. CSS overflow: auto; is applied to ensure the container is scrollable if the graph content exceeds its dimensions, making the full graph accessible.

Theme: A dark theme was implemented in the style.css to provide a distinct visual appearance.

Error Handling: Basic validation for the JSON structure and error handling for file reading and Cytoscape initialization are included to provide feedback to the user via a dedicated error message area.