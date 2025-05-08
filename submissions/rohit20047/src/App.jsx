import React from 'react';
import GraphViewer from './components/GraphicViewer';
import sample_data from './sample_json.json';
import { useState } from 'react';
const App = () => {
  const [graphData, setGraphData] = useState(sample_data);
//app.jsx

  return (

    <div className="p-4 bg-gray-900 min-h-screen">
      <GraphViewer data={graphData} />
    </div>
  );
};

export default App;