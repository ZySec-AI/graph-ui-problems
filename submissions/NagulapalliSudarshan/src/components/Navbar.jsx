import React from "react";
import { ChartNetwork } from "lucide-react";

const Navbar = () => (
  <div className="bg-gray-900 text-white p-4 shadow-md border-b border-gray-700 flex items-center gap-2 bg-gradient-to-r from-gray-900 to-slate-800">
    <ChartNetwork size={30  } className="text-blue-500" />
    <h1 className="text-2xl font-semibold">Graph Crafter</h1>
  </div>
);

export default Navbar;
