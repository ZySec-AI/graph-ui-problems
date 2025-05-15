import { ZoomIn, ZoomOut, RotateCcw, Pause, Play } from 'lucide-react';

const Controls = ({ cyInstance, zoomLevel, setZoomLevel, edgeAnimationEnabled, setEdgeAnimationEnabled }) => {
    const zoomIn = () => {
        if (cyInstance.current) {
            const newZoom = zoomLevel + 0.1;
            cyInstance.current.zoom(newZoom);
            cyInstance.current.center();
            setZoomLevel(newZoom);
        }
    };
      
    const zoomOut = () => {
        if (cyInstance.current) {
            const newZoom = zoomLevel - 0.1;
            cyInstance.current.zoom(newZoom);
            cyInstance.current.center();
            setZoomLevel(newZoom);
        }
    };
    
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
                className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
            >
                <ZoomIn size={18} />
            </button>
            <button
                onClick={zoomOut}
                className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
            >
                <ZoomOut size={18} />
            </button>
            <button
                onClick={zoomReset}
                className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
            >
                <RotateCcw size={18} />
            </button>
            <button
                onClick={() => setEdgeAnimationEnabled(prev => !prev)}
                className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
            >
                {edgeAnimationEnabled ? <Pause size={18} /> : <Play size={18} />}
            </button>
        </div>
    )
}

export default Controls;
