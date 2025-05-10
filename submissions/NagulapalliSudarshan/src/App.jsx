import React,{ useState } from "react";
import GraphView from "./components/GraphView";
import JsonInput from "./components/JsonInput";

const sampleData = {
  nodes: [
    {
      id: "user_1",
      label: "Alice",
      type: "Person",
      properties: {
        email: "alice@example.com",
        role: "Analyst"
      },
      style: {
        color: "#4CAF50",
        shape: "circle"
      },
      group: "Team A"
    },
    {
      id: "doc_1",
      label: "Report Q1",
      type: "Document",
      properties: {
        created: "2024-03-01",
        status: "approved"
      },
      style: {
        color: "#2196F3",
        shape: "rectangle"
      },
      group: "Documents"
    }
  ],
  edges: [
    {
      source: "user_1",
      target: "doc_1",
      label: "authored",
      direction: "one-way",
      style: {
        dashed: false,
        color: "#555"
      }
    }
  ],
  meta: {
    title: "Knowledge Graph - Access Control",
    description: "Sample graph representing users, documents, and policies."
  }
};

function App() {
  const [graphData, setGraphData] = useState(null);
  return (
    <div>
      <JsonInput onDataLoad={(json) => setGraphData(json)} />
      {graphData ? <GraphView data={graphData} /> : <p>No graph data loaded yet.</p>}
    </div>
  );
}

export default App;
