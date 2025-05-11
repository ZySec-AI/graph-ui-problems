import React, { useState } from "react";
import JsonInput from "./JsonInput";

const Sidebar = ({ onDataLoad }) => {
  const [activeTab, setActiveTab] = useState("file");

  return (
    <div className="w-80 bg-gray-800 text-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Input Method</h2>
        <div className="flex space-x-4">
          <div
            className={`cursor-pointer p-2 rounded-md ${activeTab === "file" ? "bg-orange-500" : "bg-gray-700"}`}
            onClick={() => setActiveTab("file")}
          >
            File Input
          </div>
          <div
            className={`cursor-pointer p-2 rounded-md ${activeTab === "text" ? "bg-orange-500" : "bg-gray-700"}`}
            onClick={() => setActiveTab("text")}
          >
            Text Input
          </div>
        </div>
      </div>

      <JsonInput
        mode={activeTab}
        onDataLoad={onDataLoad}
      />
    </div>
  );
};

export default Sidebar;
