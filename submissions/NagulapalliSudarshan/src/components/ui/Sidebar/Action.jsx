import { useState } from 'react';
import { Search, SearchX, ChevronDown, FileDown, ImageDown, FileJson } from 'lucide-react';

/**
 * Actions Component
 * 
 * Provides UI controls for interacting with the graph, including:
 * - A Search accordion to search nodes by ID or label, with input and buttons to trigger or clear search.
 * - A Downloads accordion offering options to export the graph as PNG, JPG, or JSON files.
 * 
 * Uses an AccordionItem sub-component to manage expandable/collapsible sections.
 * 
 * Props:
 * - setSearch (function): Callback to set the current search term.
 * - searchInput (string): Controlled input value for the search field.
 * - setSearchInput (function): Updates the search input value.
 * - cyInstance (ref): Reference to the Cytoscape instance for graph manipulation and export.
 * - onCloseSidebar (function): Callback to close the sidebar after actions like search or download.
 */


// AccordionItem handles individual expandable/collapsible sections
const AccordionItem = ({ title, children, index, openIndex, setOpenIndex }) => {
    const isOpen = index === openIndex;
    return (
        <div className="my-1 mx-2">
            <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center py-1 px-2 text-white hover:bg-gray-800 transition-colors border-transparent rounded cursor-pointer"
            >
                <span className="text-left text-white">
                    {title}
                </span>
                <ChevronDown
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    size={20}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    } px-4`}
            >
                <div className="py-2">{children}</div>
            </div>
        </div>
    );
};

// Main Actions component with search and download functionality
const Actions = ({ setSearch, searchInput, setSearchInput, cyInstance, onCloseSidebar }) => {
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div className="border border-slate-800 rounded-xl mt-4">
            <h2 className="text-lg text-white mb-1 bg-gradient-to-r from-gray-800 to-slate-800 w-full border-transparent pt-4 px-2 pb-2 rounded-t-xl">
                Actions
            </h2>

            <AccordionItem title="Search" index={0} openIndex={openIndex} setOpenIndex={setOpenIndex}>
                <input
                    type="text"
                    placeholder="Search nodes by ID or label..."
                    className="w-full px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            setSearch(searchInput);
                            onCloseSidebar();
                        }
                    }}
                />
                <div className="flex flex-row gap-2 flex-wrap sm:flex-nowrap mt-2">
                    <button
                        onClick={() => {
                            setSearch(searchInput);
                            onCloseSidebar();
                        }}
                        className="w-full py-1 bg-blue-900 hover:bg-blue-950 rounded-md text-white flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                    >
                        <Search size={16} />
                        Search
                    </button>
                    <button
                        onClick={() => {
                            setSearch('');
                            setSearchInput('');
                            onCloseSidebar();
                        }}
                        className="w-full py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                    >
                        <SearchX size={16} />
                        Clear Search
                    </button>
                </div>
            </AccordionItem>
            
            <hr className='text-gray-700 mx-2' />
        
            <AccordionItem
                title="Downloads"
                index={1}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
            >
                <div className="flex flex-row gap-2 text-white flex-wrap sm:flex-nowrap">
                    {/* Download Graph png */}
                    <button
                        onClick={() => {
                            if (cyInstance?.current) {
                            const png64 = cyInstance.current.png({
                                    full: true,
                                    scale: 2,
                                    bg: 'white',
                                });
                                const link = document.createElement('a');
                                link.href = png64;
                                link.download = 'graph.png';
                                link.click();
                                onCloseSidebar();
                            }
                        }}
                        className="bg-blue-900 hover:bg-blue-950 px-3 py-1 rounded cursor-pointer flex items-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                    >
                        <ImageDown size={18} />
                        PNG
                    </button>

                    {/* Download Graph jpg */}
                    <button
                        onClick={() => {
                            if (cyInstance?.current) {
                                const jpg64 = cyInstance.current.jpg({
                                    full: true,
                                    scale: 2,
                                    bg: 'white',
                                    quality: 1,
                                });
                                const link = document.createElement('a');
                                link.href = jpg64;
                                link.download = 'graph.jpg';
                                link.click();
                                onCloseSidebar();
                            }
                        }}
                        className="bg-blue-900 hover:bg-blue-950 px-3 py-1 rounded cursor-pointer flex items-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                    >
                        <FileDown size={18} />
                        JPG
                    </button>
                    
                    {/* Download Graph json */}
                    <button
                        onClick={() => {
                            if (cyInstance?.current) {
                                const json = cyInstance.current.json();
                                const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(blob);
                                link.download = 'graph.json';
                                link.click();
                                onCloseSidebar();
                            }
                        }}
                        className="bg-blue-900 hover:bg-blue-950 px-3 py-1 rounded cursor-pointer flex items-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                    >
                        <FileJson size={18} />
                        JSON
                    </button>
                </div>
            </AccordionItem>
        </div>
    );
};

export default Actions;
