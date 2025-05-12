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
  const { theme } = useTheme();

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
        <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className={`text-2xl font-bold  ${theme === 'dark' ? 'text-blue-400' :'text-blue-600'}`}>GraphCrafter</div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold  mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{data.meta.title}</h1>
            <p className={`text-gray-600 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`}>{data.meta.description}</p>
          </div>
          <div className="grid grid-cols-1  gap-8">
            <div className={`lg:col-span-3 space-y-8`}>
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}   rounded-xl shadow-xl overflow-hidden`}>
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className={` ${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-semibold dark:text-white`}>Infrastructure Graph</h2>
                    <div className='flex items-center relative'>
                      <ToggleButton />
                      <div className="p-4">
                        <SearchPanel
                          nodes={graphData.nodes}
                          onSearch={setSearchQuery}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className={`flex items-center gap-4 p-4 ${theme === 'dark' ? 'bg-gray-600':'bg-white'} rounded-xl shadow-sm`}>
                    <label htmlFor="jsonFile" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Import JSON Data:
                    </label>
                    <input
                      type="file"
                      id="jsonFile"
                      accept=".json"
                      onChange={handleFileUpload}
                      className={`text-sm  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold    ${theme === 'dark' ? 'file:text-gray-200 file:bg-gray-700 hover:file:bg-gray-800 text-gray-400' : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-gray-600 '}`}
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