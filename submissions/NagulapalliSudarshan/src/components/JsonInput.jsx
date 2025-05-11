import React, { useState } from "react";

const JsonInput = ({ mode, onDataLoad }) => {
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        onDataLoad(json);
        setError("");
      } catch {
        setError("Invalid JSON in file.");
      }
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = () => {
    try {
      const json = JSON.parse(rawText);
      onDataLoad(json);
      setError("");
    } catch {
      setError("Invalid JSON in textarea.");
    }
  };

  return (
    <div className="mt-4">
      {mode === "file" ? (
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 text-gray-700 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      ) : (
        <div>
          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste JSON here..."
            className="w-full px-4 py-2 text-gray-700 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleTextSubmit}
            className="mt-4 w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Load JSON
          </button>
        </div>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default JsonInput;
