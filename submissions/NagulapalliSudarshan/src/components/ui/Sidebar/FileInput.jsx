import React from 'react'
import { Upload, FileJson2, LogOut, Trash2, Braces, CheckCircle2 } from 'lucide-react'

const FileInput = ({ jsonLoaded, fileInputRef, handleFileChange, fileName, handleTextSubmit, loadSample, clearInput }) => {
  return (
        <div className="space-y-6 relative w-full">
            <div className={`relative h-60 border-2 border-dashed ${jsonLoaded ? "border-green-500" : "border-slate-600"} rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2`}>
                <Upload className={`text-${jsonLoaded ? "green" : "slate"}-400`} size={30} />
                <p className="text-sm text-slate-400 mb-4">
                    Drag and drop your JSON file or
                </p>
                {
                    jsonLoaded && (
                    <div className="absolute top-2 right-2 flex items-center text-green-500 text-sm">
                        <CheckCircle2 size={16} />
                        <span className="ml-1">JSON Loaded</span>
                    </div>
                    )
                }
                <input
                    type="file"
                    id="jsonFileInput"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <label htmlFor="jsonFileInput">
                    <span className="cursor-pointer bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded font-medium flex flex-row items-center justify-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform">
                        <FileJson2 size={20} />
                        Choose File
                    </span>
                </label>
                {fileName && (
                    <div className="flex items-center gap-2 text-sm shadow-sm border-t border-slate-600 pt-1">
                        <span className="text-slate-400">Selected File:</span>
                        <div className="truncate max-w-xs flex items-center gap-1"> 
                            <span className="text-sky-600">{fileName}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-2">
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
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium cursor-pointer flex items-center justify-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                    >
                        <Braces size={16} />
                        Sample data
                    </button>

                    <button
                    onClick={clearInput}
                    className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center justify-center gap-2 cursor-pointer transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                    >
                        <Trash2 size={16} />
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FileInput
