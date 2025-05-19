import { ZoomIn, ZoomOut, RotateCcw, Pause, Play } from 'lucide-react';

/**
 * Controls Component
 * 
 * Provides user interface buttons for controlling the graph visualization.
 * Includes zoom in, zoom out, zoom reset, and toggle for edge animation play/pause.
 * 
 * Props:
 * - cyInstance (ref): Reference to the Cytoscape instance controlling the graph.
 * - zoomLevel (number): Current zoom level of the graph.
 * - setZoomLevel (function): State setter to update the zoom level.
 * - edgeAnimationEnabled (boolean): Whether the edge animation is currently enabled.
 * - setEdgeAnimationEnabled (function): State setter to toggle edge animation on/off.
*/

const Controls = ({ cyInstance, zoomLevel, setZoomLevel, edgeAnimationEnabled, setEdgeAnimationEnabled }) => {
    // Function to zoom in the graph by increasing zoom level
    const zoomIn = () => {
        if (cyInstance.current) {
            const newZoom = zoomLevel + 0.1;
            cyInstance.current.zoom(newZoom);
            cyInstance.current.center();
            setZoomLevel(newZoom);
        }
    };
    
    // Function to zoom out the graph by decreasing zoom level
    const zoomOut = () => {
        if (cyInstance.current) {
            const newZoom = zoomLevel - 0.1;
            cyInstance.current.zoom(newZoom);
            cyInstance.current.center();
            setZoomLevel(newZoom);
        }
    };

    // Function to reset zoom to default (1x)
    const zoomReset = () => {
        if (cyInstance.current) {
            cyInstance.current.zoom(1);
            cyInstance.current.center();
            setZoomLevel(1);
        }
    };
    
    return (
        <div className="absolute bottom-4 right-4 flex flex-col z-10 bg-black/30 py-1 rounded-lg">
            <button
                onClick={zoomIn}
                title="Zoom In"
                className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
            >
                <ZoomIn size={18} />
            </button>
            <button
                onClick={zoomOut}
                title="Zoom Out"
                className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
            >
                <ZoomOut size={18} />
            </button>
            <button
                onClick={zoomReset}
                title="Reset Zoom"
                className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
            >
                <RotateCcw size={18} />
            </button>
            <button
                onClick={() => setEdgeAnimationEnabled(prev => !prev)}
                title={edgeAnimationEnabled ? "Pause Edge Animation" : "Play Edge Animation"}
                className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
            >
                {edgeAnimationEnabled ? <Pause size={18} /> : <Play size={18} />}
            </button>
        </div>
    )
}

export default Controls;
