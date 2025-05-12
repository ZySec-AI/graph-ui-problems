import { useEffect, useState, type ChangeEvent } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import type { Graph } from "./types/graph";
import GraphCrafter from "./components/GraphCrafter";
import ThemeProvider from "./contexts/ThemeContext";

const data = {
  nodes: [
    {
      id: "user_1",
      label: "Alice",
      type: "Person",
      properties: {
        email: "alice@example.com",
        role: "Analyst",
      },
      style: {
        color: "#4CAF50",
        shape: "circle",
      },
      group: "Team A",
    },
    {
      id: "doc_1",
      label: "Report Q1",
      type: "Document",
      properties: {
        created: "2024-03-01",
        status: "approved",
      },
      style: {
        color: "#2196F3",
        shape: "rectangle",
      },
      group: "Documents",
    },
    {
      id: "user_2",
      label: "Bob",
      type: "Person",
      properties: {
        email: "bob@example.com",
        role: "Manager",
      },
      style: {
        color: "#4CAF50",
        shape: "circle",
      },
      group: "Team B",
    },
    {
      id: "policy_1",
      label: "Edit Policy",
      type: "Policy",
      properties: {
        permission: "write",
        scope: "team",
      },
      style: {
        color: "#F44336",
        shape: "diamond",
      },
      group: "Policies",
    },
  ],
  edges: [
    {
      source: "user_1",
      target: "doc_1",
      label: "authored",
      direction: "one-way",
      style: {
        dashed: false,
        color: "#555",
      },
    },
    {
      source: "user_2",
      target: "doc_1",
      label: "reviewed",
      direction: "one-way",
      style: {
        dashed: true,
        color: "#777",
      },
    },
    {
      source: "policy_1",
      target: "user_1",
      label: "applies_to",
      direction: "one-way",
      style: {
        dashed: false,
        color: "#F44336",
      },
    },
  ],
  meta: {
    title: "Knowledge Graph - Access Control",
    description: "Sample graph representing users, documents, and policies.",
  },
};

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [graphData, setGraphData] = useState<Graph>(data);

  useEffect(() => {
    const prevGraph = localStorage.getItem("graphJson");
    if (prevGraph) {
      setGraphData(JSON.parse(prevGraph));
    }
  }, []);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const file = e.target.files![0];

    if (!file) {
      setError("No file selected. Please choose a file.");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result as string);

          setGraphData(jsonData);
          localStorage.setItem("graphJson", JSON.stringify(jsonData));
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.onerror = () => {
        console.error("Error reading the file.");
      };
      reader.readAsText(file);
    }

    setLoading(false);
  };

  const handleReset = () => {
    localStorage.setItem("graphJson", "");
    setGraphData(data);
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen flex-col bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
        <Navbar
          onFileUpload={handleFileUpload}
          onReset={handleReset}
          meta={graphData?.meta}
        />

        <GraphCrafter loading={loading} error={error} graphData={graphData} />
      </div>
    </ThemeProvider>
  );
}

export default App;
