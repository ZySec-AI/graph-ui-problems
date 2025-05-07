import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add cytoscape to the window object
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";

// Register the cose-bilkent layout
cytoscape.use(coseBilkent);

createRoot(document.getElementById("root")!).render(<App />);
