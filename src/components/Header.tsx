import React from 'react';
import { GraphMeta } from '../types/graph';
import { Share2, Info, Download } from 'lucide-react';

interface HeaderProps {
  meta: GraphMeta;
}

const Header: React.FC<HeaderProps> = ({ meta }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{meta.title}</h1>
          <p className="text-indigo-100 text-sm mt-1">{meta.description}</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="flex items-center justify-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors duration-150 text-sm">
            <Info size={16} className="mr-2" />
            <span>Help</span>
          </button>
          <button className="flex items-center justify-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors duration-150 text-sm">
            <Share2 size={16} className="mr-2" />
            <span>Share</span>
          </button>
          <button className="flex items-center justify-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors duration-150 text-sm">
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;