import { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopNavbarProps {
  onFileImport: () => void;
  searchTerm: string;
  onSearch: (search: string) => void;
}

export default function TopNavbar({ onFileImport, searchTerm, onSearch }: TopNavbarProps) {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <i className="ri-bubble-chart-fill text-primary-600 text-3xl mr-2"></i>
              <span className="text-xl font-semibold">Graph Crafter</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search nodes..."
                className="w-64 px-4 py-2 pr-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <i className="ri-search-line absolute right-3 top-2.5 text-gray-400"></i>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center text-sm" 
              onClick={onFileImport}
            >
              <i className="ri-upload-2-line mr-2"></i>
              Import JSON
            </Button>
            <Button 
              className="flex items-center text-sm"
            >
              <i className="ri-save-line mr-2"></i>
              Save
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
