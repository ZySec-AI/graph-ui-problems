import React, { useState, useCallback } from 'react';
import type { NodeData } from '../types/graphType';

interface SearchPanelProps {
    nodes: NodeData[];
    onSearch: (query: string) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
    nodes,
    onSearch,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<NodeData[]>([]);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        if (!term) {
            setSearchResults([]);
            return;
        }

        const results = nodes.filter(
            (node) =>
                node.label.toLowerCase().includes(term.toLowerCase()) ||
                node.type.toLowerCase().includes(term.toLowerCase()) ||
                Object.entries(node.properties).some(
                    ([key, value]) =>
                        key.toLowerCase().includes(term.toLowerCase()) ||
                        String(value).toLowerCase().includes(term.toLowerCase())
                )
        );

        setSearchResults(results);
        onSearch(term);
    }, [nodes, onSearch]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 relative rounded-lg shadow-lg">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search nodes..."
                    className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            {searchResults.length > 0 && (
                <div className="max-h-60 absolute z-30 bg-white w-full left-0 overflow-y-auto">
                    {searchResults.map((node) => (
                        <div
                            key={node.id}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                            onClick={() => console.log('Search result clicked:', node.id)}
                        >
                            <div className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: node.style.color }}
                                />
                                <div>
                                    <div className="font-medium dark:text-white">{node.label}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {node.type}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPanel;