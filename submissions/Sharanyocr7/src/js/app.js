document.addEventListener('DOMContentLoaded', () => {
    // Updated log to indicate this version bypasses cose-bilkent
    console.log("DOM fully loaded and parsed. app.js version 3_robust - Bypassing cose-bilkent");
    const fileInput = document.getElementById('jsonFile');
    const graphContainer = document.getElementById('graph-container');
    const graphTitleElement = document.getElementById('graphTitle');
    const graphDescriptionElement = document.getElementById('graphDescription');
    const errorMessageElement = document.getElementById('errorMessage'); // For displaying errors on page

    let cy; // Variable to hold the Cytoscape instance
    let tippyInstances = []; // To keep track of tippy tooltips

    // Clear any previous error messages on load
    if (errorMessageElement) errorMessageElement.textContent = '';

    // Check if required HTML elements exist
    if (!fileInput || !graphContainer || !graphTitleElement || !graphDescriptionElement || !errorMessageElement) {
        console.error("One or more required HTML elements are missing. Check your index.html");
        if(errorMessageElement) errorMessageElement.textContent = "Initialization Error: Missing required HTML elements.";
        // Prevent further execution if core elements aren't found
        return;
    }

    fileInput.addEventListener('change', handleFile);
    console.log("File input event listener attached.");

    // Removed the cose-bilkent registration attempt entirely
    // This code does NOT use cytoscape.use(coseBilkent);


    function handleFile(event) {
        console.log("handleFile function called.");
        // Clear previous errors, including layout warnings, unless it's an initialization error
        // CORRECTED: Use textContent before startsWith
        if (errorMessageElement && !errorMessageElement.textContent.startsWith("Initialization Error")) {
             errorMessageElement.textContent = '';
        }


        const file = event.target.files[0];
        if (!file) {
            console.log("No file selected or file selection cancelled.");
            return;
        }

        console.log("File selected:", file.name, "Type:", file.type, "Size:", file.size, "bytes");

        const reader = new FileReader();

        reader.onload = (e) => {
            console.log("FileReader: File successfully read into memory.");
            const fileContent = e.target.result;

            try {
                const jsonData = JSON.parse(fileContent);
                console.log("JSON.parse: Successfully parsed file content.", jsonData);
                renderGraph(jsonData);
            } catch (error) {
                console.error("JSON.parse Error: Failed to parse file content.", error);
                const errorMsg = `Invalid JSON file: ${error.message}. Check console for more details.`;
                alert(errorMsg); // Alert for immediate feedback
                if (errorMessageElement) errorMessageElement.textContent = errorMsg; // Show error on page
            }
        };

        reader.onerror = (e) => {
            console.error("FileReader Error: Failed to read file.", e);
            const errorMsg = "Error reading file. See console for details.";
            alert(errorMsg);
            if (errorMessageElement) errorMessageElement.textContent = errorMsg;
        };

        reader.readAsText(file); // Read the file as plain text
    }

    function renderGraph(data) {
        console.log("renderGraph: Attempting to render graph with data:", data);

        // --- Data Validation ---
        if (!data || typeof data !== 'object') {
            const errorMsg = "RenderGraph Error: Parsed data is not a valid object.";
            console.error(errorMsg, data);
            if (errorMessageElement) errorMessageElement.textContent = errorMsg;
            return;
        }
        if (!data.nodes || !Array.isArray(data.nodes)) {
            const errorMsg = "RenderGraph Error: JSON data must contain a 'nodes' array.";
            console.error(errorMsg, data);
            if (errorMessageElement) errorMessageElement.textContent = errorMsg;
            return;
        }
        if (!data.edges || !Array.isArray(data.edges)) {
            const errorMsg = "RenderGraph Error: JSON data must contain an 'edges' array.";
            console.error(errorMsg, data);
            if (errorMessageElement) errorMessageElement.textContent = errorMsg;
            return;
        }
        // --- End Data Validation ---


        // Display meta information
        if (data.meta && typeof data.meta === 'object') {
            if (graphTitleElement && data.meta.title) {
                graphTitleElement.textContent = data.meta.title;
            } else if (graphTitleElement) {
                graphTitleElement.textContent = "Graph Visualizer"; // Default if meta.title is missing
            }
            if (graphDescriptionElement && data.meta.description) {
                graphDescriptionElement.textContent = data.meta.description;
            } else if (graphDescriptionElement) {
                graphDescriptionElement.textContent = ""; // Clear description if meta.description is missing
            }
        } else {
            // Set defaults if meta object is missing
            if (graphTitleElement) graphTitleElement.textContent = "Graph Visualizer";
            if (graphDescriptionElement) graphDescriptionElement.textContent = "Loaded graph data.";
        }

        // Destroy previous Cytoscape instance if it exists
        if (cy) {
            console.log("renderGraph: Destroying previous Cytoscape instance.");
            // Before destroying cy, clean up any attached Tippy instances to prevent memory leaks
            if (tippyInstances) {
                 tippyInstances.forEach(tip => { if (tip && tip.destroy) tip.destroy(); });
                 tippyInstances = [];
            }
            cy.destroy();
            cy = null; // Explicitly set to null after destroying
        }
         // Ensure tippyInstances are cleared/destroyed even if cy didn't exist
         if (tippyInstances) {
             tippyInstances.forEach(tip => { if (tip && tip.destroy) tip.destroy(); });
             tippyInstances = [];
         }
        console.log("renderGraph: Previous tooltips destroyed.");

        const elements = [];
        try {
            // --- Transform Nodes ---
            data.nodes.forEach((node, index) => {
                if (!node || typeof node !== 'object' || !node.id) {
                    console.warn(`renderGraph: Node at index ${index} is invalid or missing ID. Skipping.`, node);
                    return; // Skip invalid node
                }
                 // Ensure node ID is a string for consistency if needed, or handle other types in data access
                elements.push({
                    group: 'nodes', // 'nodes' group for Cytoscape element type
                    data: { id: String(node.id), label: node.label || String(node.id), ...node }, // Include all original node data
                });
            });
            // --- Transform Edges ---
            data.edges.forEach((edge, index) => {
                if (!edge || typeof edge !== 'object' || !edge.source || !edge.target) {
                    console.warn(`renderGraph: Edge at index ${index} is invalid or missing source/target. Skipping.`, edge);
                    return; // Skip invalid edge
                }
                 // Ensure source/target IDs are strings
                elements.push({
                    group: 'edges', // 'edges' group for Cytoscape element type
                    data: {
                        // Generate an ID if missing, ensuring uniqueness
                        id: edge.id || `e-${String(edge.source)}-${String(edge.target)}-${index}-${Math.random().toString(16).slice(2,8)}`,
                        source: String(edge.source),
                        target: String(edge.target),
                        label: edge.label || '', // Default empty label
                        ...edge // Include all original edge data
                    },
                });
            });
        } catch (transformError) {
            console.error("renderGraph: Error transforming node/edge data.", transformError);
            if (errorMessageElement) errorMessageElement.textContent = "Error processing node/edge data. Check console.";
            return; // Stop if data transformation fails
        }
        console.log("renderGraph: Cytoscape elements prepared:", elements.length, "elements");

        // Helper to map data type to shape, with fallback
        const mapShapeFromType = (type) => {
            const typeShapeMap = {
                'user': 'ellipse', 'person': 'ellipse', // Added 'person' mapping
                'document': 'rectangle',
                'policy': 'round-diamond',
                'infrastructure': 'barrel',
                'group': 'pentagon', // Mapping for elements with type 'group'
                'default': 'ellipse' // Default shape
            };
            // Use String() and toLowerCase() for safer property access
            return typeShapeMap[String(type || '').toLowerCase()] || typeShapeMap['default'];
        };

        const globalStyles = data.styling && typeof data.styling === 'object' ? data.styling : {};

        // --- Cytoscape Styles ---
        const cytoscapeStyles = [
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'width': (ele) => ele.data('style')?.width || globalStyles.nodes?.style?.width || '60px',
                    'height': (ele) => ele.data('style')?.height || globalStyles.nodes?.style?.height || '60px',
                    'background-color': (ele) => ele.data('style')?.color || globalStyles.nodes?.style?.color || '#66B2FF',
                    'border-color': (ele) => ele.data('style')?.borderColor || globalStyles.nodes?.style?.borderColor || '#4081BF',
                    'border-width': (ele) => ele.data('style')?.borderWidth || globalStyles.nodes?.style?.borderWidth || 2,
                    'shape': (ele) => mapShapeFromType(ele.data('type')), // Map shape based on data.type
                    'font-size': (ele) => ele.data('style')?.fontSize || globalStyles.nodes?.style?.fontSize || 12,
                    'color': (ele) => ele.data('style')?.fontColor || globalStyles.nodes?.style?.fontColor || '#333',
                    'text-valign': 'center', 'text-halign': 'center', 'text-wrap': 'wrap',
                    'text-max-width': (ele) => ele.data('style')?.textMaxWidth || '80px', // Controls text wrapping width
                    'padding': (ele) => ele.data('style')?.padding || globalStyles.nodes?.style?.padding || '10px' // Padding around text label
                }
            },
            // Group-specific styles based on the 'group' data property (assuming nodes have a 'group' property)
             { selector: 'node[group="Personnel"]', style: { 'border-color': '#c92a2a', 'background-color': '#ffe3e3' } },
             { selector: 'node[group="Documents"]', style: { 'border-color': '#2f9e44', 'background-color': '#e6fcf5' } },
             { selector: 'node[group="Policies"]', style: { 'border-color': '#e67700', 'background-color': '#fff3bf' } },
             { selector: 'node[group="Infrastructure"]', style: { 'border-color': '#5f3dc4', 'background-color': '#f3f0ff'} },
             { selector: 'node[group="Groups"]', style: { 'border-color': '#7048e8', 'background-color': '#e5dbff'} }, // Style for nodes with data.group="Groups"

            {
                selector: 'edge',
                style: {
                    'label': 'data(label)',
                    'width': (ele) => ele.data('style')?.width || globalStyles.edges?.style?.width || 2,
                    'line-color': (ele) => ele.data('style')?.color || globalStyles.edges?.style?.color || '#ccc',
                    // Determine arrow shapes based on 'direction' data property
                    'target-arrow-shape': (ele) => {
                         const dir = String(ele.data('direction') || '').toLowerCase();
                         if (dir === '->' || dir === 'to') return 'triangle';
                         if (dir === '<->' || dir === 'both') return 'triangle';
                         return 'none'; // No arrow by default or for other values
                     },
                     'source-arrow-shape': (ele) => {
                         const dir = String(ele.data('direction') || '').toLowerCase();
                         if (dir === '<-' || dir === 'from') return 'triangle';
                         if (dir === '<->' || dir === 'both') return 'triangle';
                         return 'none'; // No arrow by default or for other values
                     },
                    'arrow-scale': 1.5, // Scale arrows slightly
                    'curve-style': (ele) => (ele.data('style')?.curveStyle) || (globalStyles.edges?.style?.curveStyle || 'bezier'),
                    // line-style/line-dash-pattern based on 'lineType' or 'line-style' data property
                     'line-style': (ele) => {
                         const lineType = String(ele.data('style')?.lineType || '').toLowerCase();
                         if (lineType === 'dotted') return 'dotted'; // Cytoscape supports 'dotted'
                         if (lineType === 'dashed') return 'dashed'; // Cytoscape supports 'dashed'
                         return 'solid'; // Default solid
                     },
                    // Removed line-dash-pattern as 'dotted'/'dashed' are direct line-style values

                    'font-size': (ele) => ele.data('style')?.fontSize || globalStyles.edges?.style?.fontSize || 10,
                    'color': (ele) => ele.data('style')?.fontColor || globalStyles.edges?.style?.fontColor || '#555',
                    'text-rotation': 'autorotate', 'text-margin-y': -10, // Adjust label position if needed
                    'text-background-color': '#ffffff', 'text-background-opacity': 0.7, 'text-background-padding': '2px',
                }
            },
            // Removed :hover selectors and shadow properties based on console warnings

            {
                selector: ':selected',
                style: {
                    'background-color': '#FFD700', 'line-color': '#FFC107', 'border-color': '#FFA000',
                    'border-width': 3, 'target-arrow-color': '#FFC107', 'source-arrow-color': '#FFC107',
                    'z-index': 9999 // Ensure selected elements are on top
                    // Removed shadow properties from selected selector too
                }
            }
        ];
        console.log("renderGraph: Cytoscape styles defined.");
        // --- End Cytoscape Styles ---


        // --- Cytoscape Initialization ---
        try {
            // Ensure graphContainer exists before initializing
             if (!graphContainer) {
                 throw new Error("Graph container element #graph-container not found.");
             }

            // Force use of a core layout specified in JSON, or default to 'grid'
            // Only allow core layout names from JSON
            const allowedCoreLayouts = ['cose', 'grid', 'random', 'circle', 'concentric', 'breadthfirst', 'preset']; // Added 'preset'
            const layoutName = globalStyles.layout?.name && allowedCoreLayouts.includes(globalStyles.layout.name) ? globalStyles.layout.name : 'grid';


            console.log(`Using core layout: ${layoutName}`);

            cy = cytoscape({
                container: graphContainer, // HTML container element for the graph
                elements: elements, // Array of graph elements (nodes and edges)
                style: cytoscapeStyles, // Array of style rules

                // Layout configuration - using a core layout
                layout: {
                    name: layoutName, // Use the determined core layout name

                    fit: true, // Fit the viewport to the graph
                    padding: 30, // Padding around the graph when fitting

                    // Animation settings vary by layout
                    animate: (layoutName === 'grid' || layoutName === 'random' || layoutName === 'preset' || layoutName === 'null') ? false : 'end', // Core non-force-directed usually don't animate
                    animationDuration: (layoutName === 'grid' || layoutName === 'random' || layoutName === 'preset' || layoutName === 'null') ? 0 : (globalStyles.layout?.animationDuration || 500), // Duration 0 for no animation

                     // Include node dimensions in layout calculations
                    nodeDimensionsIncludeLabels: globalStyles.layout?.nodeDimensionsIncludeLabels !== undefined ?
                                                 globalStyles.layout.nodeDimensionsIncludeLabels : true,

                     // --- Generous Default Layout Options for Core Layouts ---
                     // These defaults are applied UNLESS overridden by globalStyles.layout
                     // Spreading globalStyles.layout *after* these ensures JSON overrides
                     // Example generous defaults:

                    // Options relevant to most layouts (including grid, cose)
                    spacingFactor: globalStyles.layout?.spacingFactor || 1.5, // Added general spacing factor


                     ...(layoutName === 'grid' ? {
                         // grid specific options (more generous defaults)
                         rows: globalStyles.layout?.rows, // Let Cytoscape determine based on number of nodes
                         cols: globalStyles.layout?.cols,
                         sortBy: globalStyles.layout?.sortBy, // e.g., 'degree'
                          // Grid specific spacing adjustments (might vary)
                          cellWidth: globalStyles.layout?.cellWidth, // Explicit cell width
                          cellHeight: globalStyles.layout?.cellHeight, // Explicit cell height
                          // Note: Grid spacing is often implicit based on node size and container
                     } : {}),
                      ...(layoutName === 'cose' ? {
                          // core cose specific options (more generous defaults for spread)
                          nodeRepulsion: globalStyles.layout?.nodeRepulsion || 800000, // Increased default repulsion
                          idealEdgeLength: globalStyles.layout?.idealEdgeLength || 200, // Increased default edge length
                          edgeElasticity: globalStyles.layout?.edgeElasticity || 1,
                          gravity: globalStyles.layout?.gravity || 40, // Reduced default gravity
                          numIter: globalStyles.layout?.numIter || 2500, // Increased iterations
                          initialTemp: globalStyles.layout?.initialTemp || 1500, // Increased initial temperature
                          coolingFactor: globalStyles.layout?.coolingFactor || 0.99,
                          minTemp: globalStyles.layout?.minTemp || 1.0,
                     } : {}),
                     // Add more generous defaults for other core layouts if you support them
                     // ...(layoutName === 'circle' ? { radius: globalStyles.layout?.radius || 300, ... } : {}),
                     // ...(layoutName === 'concentric' ? { minNodeSpacing: globalStyles.layout?.minNodeSpacing || 50, ... } : {}),


                     // Spread global styles layout options LAST to ensure they override any defaults above
                     // This is important! It lets your JSON values take precedence.
                     ...(globalStyles.layout || {}),

                },

                 // Interaction options (can be overridden by globalStyles.interaction)
                zoomingEnabled: globalStyles.interaction?.zoomView !== undefined ? globalStyles.interaction.zoomView : true, // Enable/disable zooming
                userZoomingEnabled: globalStyles.interaction?.zoomView !== undefined ? globalStyles.interaction.zoomView : true, // Enable/disable user zooming
                panningEnabled: globalStyles.interaction?.dragView !== undefined ? globalStyles.interaction.dragView : true, // Enable/disable panning
                userPanningEnabled: globalStyles.interaction?.dragView !== undefined ? globalStyles.interaction.dragView : true, // Enable/disable user panning
                boxSelectionEnabled: globalStyles.interaction?.multiselect !== undefined ? globalStyles.interaction.multiselect : false, // Enable/disable box selection
                // autoungrabify: If true, nodes are ungrabbable (not draggable by user)
                autoungrabify: globalStyles.interaction?.dragNodes === false, // Make nodes ungrabbable if dragNodes is false in JSON
                autounselectify: false, // Keep false to allow elements to be selected
                minZoom: 0.1, // Minimum zoom level
                maxZoom: 3, // Maximum zoom level
            });
            console.log("renderGraph: Cytoscape instance created:", cy);

            // --- Add Hover Effects using Events ---
             // This logic uses element.style() which seems okay, unlike removeStyle()
             cy.elements().on('mouseover', function() {
                 // Apply hover styles
                 const hoverStyles = {};
                 if (this.isNode()) {
                      hoverStyles['background-color'] = this.data('style')?.hoverColor || globalStyles.nodes?.style?.hoverColor || '#4D90FE';
                      hoverStyles['border-color'] = this.data('style')?.hoverBorderColor || globalStyles.nodes?.style?.hoverBorderColor || '#2A75E8';
                      hoverStyles['border-width'] = (this.data('style')?.borderWidth || globalStyles.nodes?.style?.borderWidth || 2) * 1.5;
                      // Use a high z-index on hover, but ensure selected stays highest
                       hoverStyles['z-index'] = this.selected() ? 10001 : 10000; // Higher than base selected (9999)
                 } else { // edge
                      hoverStyles['line-color'] = this.data('style')?.hoverColor || globalStyles.edges?.style?.hoverColor || '#777';
                      hoverStyles['width'] = (this.data('style')?.width || globalStyles.edges?.style?.width || 2) * 1.8;
                      hoverStyles['target-arrow-color'] = this.data('style')?.hoverColor || globalStyles.edges?.style?.hoverColor || '#777';
                      hoverStyles['source-arrow-color'] = this.data('style')?.hoverColor || globalStyles.edges?.style?.hoverColor || '#777';
                      // Use a high z-index on hover, but ensure selected stays highest
                       hoverStyles['z-index'] = this.selected() ? 10001 : 9999; // Higher than base edge (9998)
                 }
                 this.style(hoverStyles);
             });

              // Use style reset here instead of removeStyle to avoid the previous TypeError
              cy.elements().on('mouseout', function() {
                  // Revert styles on mouseout by setting them back to their base values
                  const base = {};
                  if (this.isNode()) {
                       // Base styles from your stylesheet/data
                       base['background-color'] = this.data('style')?.color || globalStyles.nodes?.style?.color || '#66B2FF';
                       base['border-color'] = this.data('style')?.borderColor || globalStyles.nodes?.style?.borderColor || '#4081BF';
                       base['border-width'] = this.data('style')?.borderWidth || globalStyles.nodes?.style?.borderWidth || 2;
                       // Base z-index from stylesheet
                       base['z-index'] = this.selected() ? 9999 : 9999; // Keep selected on top, base node z-index
                  } else { // edge
                       // Base styles from your stylesheet/data
                       base['line-color'] = this.data('style')?.color || globalStyles.edges?.style?.color || '#ccc';
                       base['width'] = this.data('style')?.width || globalStyles.edges?.style?.width || 2;
                       base['target-arrow-color'] = this.data('style')?.color || globalStyles.edges?.style?.color || '#ccc';
                       base['source-arrow-color'] = this.data('style')?.color || globalStyles.edges?.style?.color || '#ccc';
                       // Base z-index from stylesheet
                       base['z-index'] = this.selected() ? 9999 : 9998; // Keep selected on top, base edge z-index
                  }
                   this.style(base); // Apply base styles
             });
            // --- End Hover Effects ---


            // --- Add Tooltips ---
            console.log("renderGraph: About to add tooltips. Number of elements:", cy.elements().length);
            cy.elements().forEach(ele => {
                // Tooltip content generation
                let tooltipHTML = `<strong>${ele.data('label') || ele.id()}</strong><br>`;
                if (ele.data('type')) { tooltipHTML += `<em>Type:</em> ${ele.data('type')}<br>`; }
                if (ele.data('group')) { tooltipHTML += `<em>Group:</em> ${ele.data('group')}<br>`; }
                const properties = ele.data('properties');
                if (properties && typeof properties === 'object' && Object.keys(properties).length > 0) {
                    tooltipHTML += `<u>Properties:</u><br>`;
                    for (const key in properties) {
                        if (Object.prototype.hasOwnProperty.call(properties, key)) {
                             // Basic sanitization for property values displayed in tooltip
                             const value = String(properties[key]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '>').replace(/"/g, '&quot;'); // Added escaping for quotes
                            tooltipHTML += `&nbsp;&nbsp;<em>${key}:</em> ${value}<br>`;
                        }
                    }
                }
                const customTitle = ele.data('title');
                // Use customTitle if present, replacing newlines with <br>
                // Otherwise, use the generated tooltipHTML
                const finalTooltipContent = customTitle ? String(customTitle).replace(/\n/g, '<br>') : tooltipHTML;


                // Only create a tooltip if there's content beyond just the label/id
                const hasExtraContent = (ele.data('type') || ele.data('group') || (properties && Object.keys(properties).length > 0) || customTitle);

                // Check if tippy and popperRef are available before creating tooltip
                if (typeof tippy === 'undefined') {
                     // console.warn("renderGraph: Tippy library not available. Skipping tooltips.");
                     // You might want to log this outside the loop once
                     return; // Skip this element
                }
                 // Ensure popperRef is a function (provided by cytoscape-popper.js, often bundled with Tippy in CDNs)
                 if (typeof ele.popperRef !== 'function') {
                     // console.warn("renderGraph: ele.popperRef is not a function on element:", ele.id(), ". Skipping tooltip for this element. Cytoscape Popper extension might be missing or not working correctly.");
                     return; // Skip this element if popperRef is not available
                 }


                 if (hasExtraContent) { // Only create tooltip if there's more than just the label
                     const ref = ele.popperRef(); // Get the reference element for positioning
                     const dummyDomEle = document.createElement('div'); // Create a dummy element Tippy can attach to

                     const tip = tippy(dummyDomEle, { // Initialize Tippy
                         getReferenceClientRect: ref.getBoundingClientRect, // Position relative to the element
                         trigger: 'manual', // We control showing/hiding via events
                         content: () => { // Content can be a function
                              const div = document.createElement('div');
                              div.innerHTML = finalTooltipContent; // Use innerHTML if content contains <br> or other HTML
                              return div;
                         },
                         arrow: true, // Show an arrow pointing to the element
                         placement: ele.isNode() ? 'top' : 'top', // Position tooltip above element
                         hideOnClick: false, // Keep tooltip open when clicking outside (can change)
                         interactive: true, // Allow interacting with content inside the tooltip
                         appendTo: document.body, // Append tooltip to the body to avoid clipping issues
                         theme: 'light', // Apply the 'light' theme (requires tippy.css and theme css)
                         delay: [globalStyles.interaction?.tooltipDelay || 100, 0], // Show delay (ms), Hide delay (ms)
                         duration: [100, 100], // Animation duration for show/hide

                         // Use onCreate/onDestroy to manage event listeners and cleanup
                         onCreate(instance) {
                              // Show tooltip on mouseover
                              ele.on('mouseover', () => instance.show());
                              // Hide tooltip on mouseout
                              ele.on('mouseout', () => instance.hide());
                              // Update tooltip position when element moves or graph pans/zooms
                              ele.on('position drag', () => { if (instance.popperInstance) { instance.popperInstance.update(); } });
                         },
                         onDestroy() {
                              // Clean up event listeners when the tooltip is destroyed (important for memory)
                              ele.off('mouseover');
                              ele.off('mouseout');
                              ele.off('position drag');
                         }
                     });
                     // Store the tooltip instance
                     tippyInstances.push(tip);
                 }
            });
            console.log("renderGraph: Tooltips processing complete.");
            // --- End Tooltips ---


            // --- Add Graph Event Listeners ---
            // Update tooltip positions when graph view changes (pan, zoom, resize)
            cy.on('pan zoom resize', () => {
                tippyInstances.forEach(tip => { if (tip && tip.popperInstance) { tip.popperInstance.update(); } });
            });

            // Log element data on tap (click)
            cy.on('tap', 'node', (evt) => { console.log('Tapped Node:', evt.target.id(), evt.target.data()); });
            cy.on('tap', 'edge', (evt) => { console.log('Tapped Edge:', evt.target.id(), evt.target.data()); });

            // Tap background to unselect all elements
            cy.on('tap', (event) => {
                // Check if the target of the tap is the graph instance itself, not an element
                if (event.target === cy) {
                    cy.elements().unselect(); // Unselect all elements
                    console.log('Tapped background - elements unselected.');
                }
            });
            // --- End Graph Event Listeners ---


            // --- Fit Graph to View ---
            // Delay the fit operation based on whether the layout animates
            const layoutAnimationDuration = (layoutName === 'grid' || layoutName === 'random' || layoutName === 'preset' || layoutName === 'null') ? 0 : (globalStyles.layout?.animationDuration || 500);
            const fitDelay = layoutAnimationDuration + 100; // Delay slightly after expected layout animation ends

            setTimeout(() => {
                // Check if cy instance is valid, not destroyed, and has elements to fit
                if (cy && !cy.destroyed() && cy.elements().length > 0) {
                     // Fit all elements in the graph to the viewport with padding
                     cy.fit(cy.elements(), 30); // Fit all elements with 30px padding
                    console.log("renderGraph: Graph fitted to view.");
                } else if (cy && !cy.destroyed()) {
                     // Log if there are no elements to fit
                    console.log("renderGraph: No elements to fit in the graph.");
                }
            }, fitDelay); // Use adjusted delay
            // --- End Fit Graph ---

            console.log("renderGraph: Graph rendering process complete.");
            // Clear non-critical error messages if rendering completed
             const currentErrorMessage = errorMessageElement.textContent;
             if (currentErrorMessage &&
                 !currentErrorMessage.startsWith('Invalid JSON file') &&
                 !currentErrorMessage.startsWith('RenderGraph Error') &&
                 !currentErrorMessage.startsWith('Error initializing graph') &&
                 !currentErrorMessage.startsWith('Initialization Error'))
             {
                 // If there's a message that isn't a fatal rendering error, keep it (e.g., layout warning)
             } else if (currentErrorMessage) {
                  // If it was a fatal rendering error, keep it
             } else {
                 // No error message, clear any old one
                 errorMessageElement.textContent = '';
             }


        } catch (cytoscapeError) {
            // This catch block handles errors during Cytoscape instantiation,
            // e.g., if the *chosen core layout* failed (highly unlikely)
            // or errors caused by invalid element data not caught in the transform step, etc.
            console.error("renderGraph: Error initializing Cytoscape.", cytoscapeError);
             const errorMsg = `Error initializing graph display: ${cytoscapeError.message}. Check console for details.`;
            if (errorMessageElement) errorMessageElement.textContent = errorMsg;
             // No return here, as the function might proceed to cleanup (though cleanup after init failure is minimal)
        }
        // --- End Cytoscape Initialization ---
    }

    // Optional: Load a default graph (ensure 'data/sample-graph.json' is the correct path
    // AND your local server can serve this file via HTTP)
    /*
    fetch('data/sample-graph.json') // <<<<<<< MAKE SURE THIS FILENAME IS CORRECT AND ACCESSIBLE VIA HTTP
        .then(response => {
            console.log('Fetch response received for default graph:', response);
            if (!response.ok) {
                // Log details for debugging network/file access issues
                console.error(`HTTP error! status: ${response.status}, ${response.statusText} for ${response.url}`);
                throw new Error(`HTTP error! status: ${response.status} for ${response.url}`);
            }
            return response.json(); // This can also throw if content is not valid JSON
        })
        .then(data => {
            console.log("Default graph data loaded successfully:", data);
            renderGraph(data); // Render the default graph
        })
        .catch(error => {
            console.error('Error loading or parsing default graph:', error);
            const errorMsg = `Could not load default graph: ${error.message}. Please select a file manually.`;
            if (errorMessageElement) errorMessageElement.textContent = errorMsg;
            // alert(errorMsg); // Optional: alert user for default load failure
        });
    */

}); // End of DOMContentLoaded