/**
 * Tabs Component
 * 
 * Renders two toggle buttons to switch between "JSON Data" and "File Upload" modes.
 * 
 * Props:
 * - activeTab (string): Currently active tab name ("JSON Data" or "File Upload").
 * - setActiveTab (function): Function to update the active tab.
*/

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex mb-2 border-b border-slate-600">
        {   
            ["JSON Data", "File Upload"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-1/2 text-sm font-medium px-3 py-2 rounded-t-md transition-all 
                    ${
                        activeTab === tab
                        ? "bg-blue-950 text-white borde border-b-0 shadow-inner cursor-pointer hover:bg-slate-700"
                        : "bg-slate-900 text-slate-400 cursor-pointer hover:bg-slate-700 hover:text-slate-200"
                    }`}
                >
                    {tab}
                </button>
            ))
        }
    </div>
  )
}

export default Tabs;
