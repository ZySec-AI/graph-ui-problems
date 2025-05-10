import React, { useState } from "react";

const JsonInput = ({ onDataLoad }) => {
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
      } catch (err) {
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
    } catch (err) {
      setError("Invalid JSON in textarea.");
    }
  };

  return (
    <div style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <h3>Load Graph JSON</h3>

      <div>
        <label>
          Upload JSON File:{" "}
          <input type="file" onChange={handleFileChange} />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Paste JSON:</label>
        <textarea
          rows={8}
          cols={80}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste full JSON here..."
        />
        <br />
        <button onClick={handleTextSubmit}>Load JSON</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default JsonInput;
