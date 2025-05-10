import { useState, useEffect } from 'react'
import Graph from './components/Graph'
import GraphInput from './components/GraphInput'
import GraphSearch from './components/GraphSearch'
import { useDarkMode } from './hooks/useDarkMode'
import type { GraphData } from './types/graph'
import './App.css'

const App = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [darkMode, toggleDarkMode] = useDarkMode()
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isNavOpen, setIsNavOpen] = useState(false)

  const handleSearchResults = (nodeIds: string[]) => {
    setSearchResults(nodeIds)
  }

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-200 w-[100vw]`}>
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 py-3 px-4 sm:px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 mr-3 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Interactive Graph Visualizer
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              className={`hidden sm:flex px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                darkMode ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 shadow-sm'
              }`}
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light Mode
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark Mode
                </span>
              )}
            </button>

            <button 
              className="block sm:hidden text-white focus:outline-none"
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isNavOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800 shadow-md">
          <div className="px-4 py-3 space-y-2">
            <button
              className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Switch to Light Mode
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Switch to Dark Mode
                </span>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Split-view layout for larger screens */}
      <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-64px)]">
        {/* Left panel - Input and controls (fixed width on large screens) */}
        <aside className="lg:w-[400px] xl:w-[450px] lg:min-h-[calc(100vh-64px)] lg:max-h-[calc(100vh-64px)] lg:overflow-y-auto p-4 bg-white dark:bg-gray-800 lg:border-r border-gray-200 dark:border-gray-700 shadow-md">
          <div className="mb-6">
            <GraphInput onDataLoaded={setGraphData} />
          </div>
          
          {graphData && (
            <div className="mb-6">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{graphData.meta?.title || 'Graph Visualization'}</h2>
                    {graphData.meta?.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{graphData.meta.description}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {graphData.nodes.length} Nodes
                    </div>
                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded-full text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {graphData.edges.length} Edges
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {graphData && (
            <div className="mb-6">
              <GraphSearch graphData={graphData} onSearchResult={handleSearchResults} />
            </div>
          )}
          
          {/* Footer for sidebar */}
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            <p>Built with React, Vite, and Cytoscape.js</p>
          </div>
        </aside>
        
        {/* Right panel */}
        <main className="flex-1 p-0 lg:p-4 lg:min-h-[calc(100vh-64px)] lg:max-h-[calc(100vh-64px)] lg:overflow-y-auto">
          {graphData ? (
            <div className="h-full w-full">
              <Graph graphData={graphData} searchResults={searchResults} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md">
              <div className="max-w-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-400 dark:text-indigo-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Welcome to Graph Visualizer</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Load your graph data using the input panel on the left to visualize relationships and connections.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="animate-pulse">Tip: Click "Load Sample Data" to see an example visualization</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      
    </div>
  )
}

export default App
