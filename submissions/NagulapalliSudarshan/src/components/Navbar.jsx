import React from "react";
import { ChartNetwork, Menu, X } from "lucide-react";

const Navbar = ({ toggleSidebar,isSidebarOpen }) => (
  <div className="bg-gray-900 text-white p-4 shadow-md border-b border-gray-700 flex items-center justify-between gap-2 bg-gradient-to-r from-gray-900 to-slate-800">
    <div className="flex items-center">
      <ChartNetwork size={30} className="text-blue-500" />
      <h1 className="text-2xl font-semibold">Graph Crafter</h1>
    </div>
    <button
      className="lg:hidden text-white focus:outline-none "
      onClick={toggleSidebar}
      aria-label="Toggle Sidebar"
    >
      {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>
);

export default Navbar;
