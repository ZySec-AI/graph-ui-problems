import { ChartNetwork, Menu, X } from "lucide-react";

/**
 * Navbar Component
 * 
 * This component renders a responsive navigation bar for the application.
 * 
 * Features:
 * - Displays the app logo (using ChartNetwork icon) and title "JSON Visualizer"
 * - Contains a toggle button that switches between open and close icons (Menu and X)
 * - The toggle button controls the visibility of a sidebar on smaller screens (responsive)
 * - Uses Tailwind CSS for styling and layout with a gradient background and shadow
 * 
 * Props:
 * - toggleSidebar: function to open or close the sidebar
 * - isSidebarOpen: boolean indicating the current sidebar state
*/

const Navbar = ({ toggleSidebar, isSidebarOpen }) => (
  <div className="bg-gray-900 text-white p-4 shadow-md border-b border-gray-700 flex items-center justify-between gap-2 bg-gradient-to-r from-gray-900 to-slate-800">
    <div className="flex items-center gap-2">
      <ChartNetwork size={30} className="text-blue-500" />
      <h1 className="text-2xl font-semibold">JSON Visualizer</h1>
    </div>
    <button
      className="lg:hidden text-white focus:outline-none "
      onClick={toggleSidebar}              // Calls function to open/close sidebar
      aria-label="Toggle Sidebar"
    >
      {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>
);

export default Navbar;
