/**
 * Module declaration for 'cytoscape-qtip'
 * This allows TypeScript to recognize the 'cytoscape-qtip' plugin, 
 * which adds tooltip functionality to Cytoscape.js nodes and edges.
 */
declare module 'cytoscape-qtip' {
  import cytoscape from 'cytoscape';
  const qtip: (cytoscape: typeof cytoscape) => void;
  export default qtip;
}
