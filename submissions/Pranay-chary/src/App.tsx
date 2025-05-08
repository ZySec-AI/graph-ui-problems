import { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { toPng } from 'html-to-image';
import GraphView from './components/GraphView';
import SearchPanel from './components/SearchPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import SettingsPanel from './components/SettingsPanel';
import useDarkMode from './hooks/useDarkMode';

import { cloudInfraData } from './data/cloud-infrastructure';
import './styles/dark-theme.css';

interface GraphSettings {
  showLabels: boolean;
  showIcons: boolean;
  layout: 'horizontal' | 'vertical' | 'radial';
  nodePadding: number;
  nodeSpacing: number;
  zoomLevel: number;
}

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState('graph');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Graph settings state
  const [graphSettings, setGraphSettings] = useState<GraphSettings>({
    showLabels: true,
    showIcons: true,
    layout: 'horizontal',
    nodePadding: 20,
    nodeSpacing: 50,
    zoomLevel: 1
  });

  // Analytics state
  const [graphData, setGraphData] = useState(cloudInfraData);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setGraphData(jsonData);
          // Update analytics with new data
          setAnalyticsData({
            responseTime: '120ms',
            successRate: '99.9%',
            errorRate: '0.1%',
            activeNodes: jsonData.nodes.length,
            totalConnections: jsonData.edges.length
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const [analyticsData, setAnalyticsData] = useState({
    responseTime: '120ms',
    successRate: '99.9%',
    errorRate: '0.1%',
    activeNodes: graphData.nodes.length,
    totalConnections: graphData.edges.length
  });

  // Update graph settings
  const handleSettingsChange = useCallback((newSettings: Partial<GraphSettings>) => {
    setGraphSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Export graph as PNG
  const handleExportImage = useCallback(async () => {
    // Switch to graph view temporarily
    const currentView = selectedView;
    setSelectedView('graph');

    // Wait for view switch and render
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const container = document.querySelector('.react-flow-wrapper') as HTMLElement;
      if (!container) {
        console.error('Could not find graph container');
        return;
      }

      // Store original styles
      const originalHeight = container.style.height;
      const originalOverflow = container.style.overflow;
      const originalDisplay = container.style.display;

      // Temporarily modify container to capture full content
      container.style.height = 'auto';
      container.style.overflow = 'visible';
      container.style.display = 'block';

      // Wait for styles to take effect
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(container, {
        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        quality: 1,
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
        },
        filter: (node) => {
          // Exclude any unwanted elements from the export
          const className = typeof node.className === 'string' ? node.className : '';
          return !className.includes('react-flow__minimap') &&
                 !className.includes('react-flow__controls') &&
                 !className.includes('react-flow__attribution');
        }
      });

      // Restore original styles
      container.style.height = originalHeight;
      container.style.overflow = originalOverflow;
      container.style.display = originalDisplay;

      // Download the image
      const link = document.createElement('a');
      link.download = 'graph-export.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      // Switch back to original view
      setSelectedView(currentView);
    }
  }, [isDarkMode, selectedView, setSelectedView]);

  // Export graph data as JSON
  const handleExportData = useCallback(() => {
    const data = {
      nodes: graphData.nodes,
      edges: graphData.edges,
      settings: graphSettings,
      analytics: analyticsData
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'graph-data.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [graphSettings, analyticsData]);

  // Update analytics data periodically
  const updateAnalytics = useCallback(() => {
    setAnalyticsData(prev => ({
      ...prev,
      responseTime: `${Math.floor(Math.random() * 50 + 100)}ms`,
      successRate: `${(99.8 + Math.random() * 0.2).toFixed(2)}%`,
      errorRate: `${(0.2 - Math.random() * 0.2).toFixed(2)}%`
    }));
  }, []);

  // Set up periodic analytics updates
  useEffect(() => {
    updateAnalytics(); // Initial update
    const interval = setInterval(updateAnalytics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [updateAnalytics]);

  return (
    <ReactFlowProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🔍 GraphCrafter</div>
                <nav className="hidden md:flex space-x-1">
                  {['graph', 'analytics', 'settings'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setSelectedView(view)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedView === view
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Toggle theme"
                >
                  {isDarkMode ? '🌞' : '🌙'}
                </button>
                <a
                  href="https://github.com/yourusername/graphcrafter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="View on GitHub"
                >
                  <span role="img" aria-label="github">📦</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold dark:text-white mb-2">{cloudInfraData.meta.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{cloudInfraData.meta.description}</p>
          </div>

          {/* Content Grid */}
          {selectedView === 'graph' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Panel */}
              <div className={`${isFullscreen ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-8`}>
                {/* Graph View */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold dark:text-white">Infrastructure Graph</h2>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          title="Reset zoom"
                        >
                          <span role="img" aria-label="reset">🔄</span>
                        </button>
                        <button 
                          onClick={() => setIsFullscreen(!isFullscreen)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                          <span role="img" aria-label="fullscreen">{isFullscreen ? '⛶' : '⛶'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                      <label htmlFor="jsonFile" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Import JSON Data:
                      </label>
                      <input
                        type="file"
                        id="jsonFile"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
                      />
                    </div>
                    <GraphView
                      data={graphData}
                      settings={graphSettings}
                      searchQuery={searchQuery}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              {!isFullscreen && (
                <div className="space-y-8">
                  {/* Search Panel */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700">
                      <h2 className="text-lg font-semibold dark:text-white">Search</h2>
                    </div>
                    <div className="p-4">
                      <SearchPanel
                        nodes={graphData.nodes}
                        onSearch={setSearchQuery}
                      />
                    </div>
                  </div>

                  {/* Analytics Panel */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700">
                      <h2 className="text-lg font-semibold dark:text-white">Analytics</h2>
                    </div>
                    <div className="p-4">
                      <AnalyticsPanel
                        nodes={cloudInfraData.nodes}
                        edges={cloudInfraData.edges}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedView === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                  <h2 className="text-lg font-semibold dark:text-white">Graph Analytics</h2>
                </div>
                <div className="p-6">
                  <AnalyticsPanel
                    nodes={graphData.nodes}
                    edges={graphData.edges}
                  />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                  <h2 className="text-lg font-semibold dark:text-white">Performance Metrics</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Average Response Time</span>
                      <span className="font-medium dark:text-white">{analyticsData.responseTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{analyticsData.successRate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Error Rate</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{analyticsData.errorRate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Active Nodes</span>
                      <span className="font-medium dark:text-white">{analyticsData.activeNodes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Connections</span>
                      <span className="font-medium dark:text-white">{analyticsData.totalConnections}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <SettingsPanel
                isDarkMode={isDarkMode}
                onThemeChange={toggleDarkMode}
                settings={graphSettings}
                onSettingsChange={handleSettingsChange}
                onExportImage={handleExportImage}
                onExportData={handleExportData}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © 2025 GraphCrafter. Built with 💙 for visualization.
              </div>
              <div className="flex space-x-4">
                <a
                  href="#documentation"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Documentation
                </a>
                <a
                  href="#api"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  API
                </a>
                <a
                  href="#support"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
