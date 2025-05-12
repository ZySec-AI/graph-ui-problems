import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import GraphViewer from './components/GraphViewer';
import SearchPanel from './components/SearchPanel';
import data from './json/smaple_josn.json';
import { useTheme } from './context/ThemeContext';
import ToggleButton from './components/ToggleButton';

interface GraphSettings {
  showLabels: boolean;
  showIcons: boolean;
  layout: 'horizontal' | 'vertical' | 'radial';
  nodePadding: number;
  nodeSpacing: number;
  zoomLevel: number;
}

function App() {
  const { theme} = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const [graphSettings, setGraphSettings] = useState<GraphSettings>({
    showLabels: true,
    showIcons: true,
    layout: 'horizontal',
    nodePadding: 20,
    nodeSpacing: 50,
    zoomLevel: 1
  });

  // Analytics state
  const [graphData, setGraphData] = useState(data);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setGraphData(jsonData);
          // Update analytics with new data
          
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };
  return (
    <ReactFlowProvider>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">GraphCrafter</div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold dark:text-white mb-2">{data.meta.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{data.meta.description}</p>
          </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className={`lg:col-span-3 space-y-8`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold dark:text-white">Infrastructure Graph</h2>
                      <ToggleButton/>
                      <div className="p-4">
                        <SearchPanel
                          nodes={graphData.nodes}
                          onSearch={setSearchQuery}
                        />
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
                    <GraphViewer
                      data={graphData}
                      settings={graphSettings}
                      searchQuery={searchQuery}
                    />
                  </div>
                </div>
              </div>
            </div>

        </main>
      </div>
    </ReactFlowProvider>
  );
}

export default App;