import React from 'react'
import { LogOut, Trash2, Braces, CheckCircle2 } from 'lucide-react'

const JsonInput = ({ jsonLoaded, rawText, setRawText, handleTextSubmit, clearInput, loadSample }) => {
  return (
    <div className="space-y-2 w-full">
    {jsonLoaded && (
      <div className="text-green-500 flex items-center justify-end gap-1 text-sm">
        <CheckCircle2 size={16} />
        JSON Loaded
      </div>
    )}

    <textarea
      rows={11}
      value={rawText}
      onChange={(e) => setRawText(e.target.value)}
      placeholder="Paste your JSON here..."
      className={`w-full text-sm px-4 py-3 text-gray-200 bg-slate-800 border ${
        jsonLoaded ? "border-green-500" : "border-slate-700"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-grey-500 resize-none custom-scrollbar`}
    />

    <button
      onClick={handleTextSubmit}
      className="w-full py-2 bg-blue-900 hover:bg-blue-950 rounded-md text-white flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
    >
      <LogOut size={16} />
      Apply JSON
    </button>

    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
      <button
        onClick={loadSample}
        className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform flex items-center justify-center gap-2"
      >
        <Braces size={16} />
        Sample data
      </button>

      <button
        onClick={clearInput}
        className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
      >
        <Trash2 size={16} />
        Clear
      </button>
    </div>
  </div>
  )
}

export default JsonInput;
