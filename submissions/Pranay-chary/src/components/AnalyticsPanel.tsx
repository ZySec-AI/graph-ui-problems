import React, { useMemo } from 'react';
import type { NodeData, EdgeData } from '../types/graph';

interface AnalyticsPanelProps {
  nodes: NodeData[];
  edges: EdgeData[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ nodes, edges }) => {
  const analytics = useMemo(() => {
    const groupCounts = nodes.reduce((acc, node) => {
      acc[node.group] = (acc[node.group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeCounts = nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const connectionCounts = edges.reduce((acc, edge) => {
      acc[edge.source] = (acc[edge.source] || 0) + 1;
      acc[edge.target] = (acc[edge.target] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostConnected = Object.entries(connectionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => nodes.find(n => n.id === id)!)
      .filter(Boolean);

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      groupCounts,
      typeCounts,
      mostConnected,
    };
  }, [nodes, edges]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Graph Analytics</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded">
            <div className="text-sm text-blue-600 dark:text-blue-200">Nodes</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-100">{analytics.totalNodes}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-3 rounded">
            <div className="text-sm text-green-600 dark:text-green-200">Edges</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-100">{analytics.totalEdges}</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Most Connected Nodes</h4>
          <div className="space-y-2">
            {analytics.mostConnected.map((node) => (
              <div key={node.id} className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: node.style.color }}
                />
                <span className="text-sm dark:text-gray-300">{node.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Groups Distribution</h4>
          <div className="space-y-1">
            {Object.entries(analytics.groupCounts).map(([group, count]) => (
              <div key={group} className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">{group}</span>
                <span className="text-sm font-medium dark:text-gray-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
