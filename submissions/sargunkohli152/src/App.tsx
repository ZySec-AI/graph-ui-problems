import { useState, useRef, useEffect } from 'react';
import Graph from './components/Graph';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { type GraphData } from './types/graph';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SampleDataModal from './components/SampleDataModal';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Main application component that manages the graph visualization interface
function App() {
  // State for graph layout direction (Left-to-Right or Top-to-Bottom)
  const [layoutDirection, setLayoutDirection] = useState<'LR' | 'TB'>('LR');
  // Controls sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Stores the current graph data structure
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  // Manages toast notification messages
  const [toast, setToast] = useState<string | null>(null);
  // Tracks if screen size is medium or smaller for responsive design
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  // Reference to store toast timeout for cleanup
  const toastTimeout = useRef<number | null>(null);

  // Handle responsive sidebar behavior based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMediumScreen(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Utility function to display temporary toast notifications
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-[50%] z-50 bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <ErrorOutlineIcon />
          <span>{toast}</span>
        </div>
      )}

      <SampleDataModal onLoadGraph={setGraphData} onError={showToast} />
      <div className="flex h-[calc(100vh-4rem)]">
        {sidebarOpen && (
          <Sidebar
            onClose={() => setSidebarOpen(false)}
            onLoadGraph={setGraphData}
            onError={showToast}
            currentGraph={graphData}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            layoutDirection={layoutDirection}
            setLayoutDirection={setLayoutDirection}
          />
        )}
        <main className="flex-1 relative md:block hidden mb-4">
          {!sidebarOpen && !isMediumScreen && (
            <button
              className="absolute top-8 left-8 z-50 transition-all duration-1000 ease-in-out bg-white dark:bg-gray-800 backdrop-blur-sm px-2 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuOutlinedIcon fontSize="small" />
            </button>
          )}
          {graphData ? (
            <Graph
              rawData={graphData}
              layoutDirection={layoutDirection}
              setLayoutDirection={setLayoutDirection}
              isSidebarOpen={sidebarOpen}
            />
          ) : (
            <div className="w-full h-[calc(100vh-4rem)] flex-col p-4 space-y-4">
              <div className="w-full h-full relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-center items-center">
                <TimelineOutlinedIcon
                  style={{ fontSize: 64 }}
                  className="text-gray-400 dark:text-gray-500 mx-auto"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  Paste or upload JSON to render the graph.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
