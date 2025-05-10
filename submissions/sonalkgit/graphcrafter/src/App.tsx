import Graph from './components/Graph';
import sampleGraphData from './data/sample_graph.json';
import type { GraphData } from './types';

const graphData = sampleGraphData as GraphData;

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>{graphData.meta.title}</h1>
      </header>
      <main className="main-content">
      <div className="graph-window">
        <Graph graphData={graphData} />
      </div>
    </main>
    </div>
  );
}

export default App;
