import { create } from 'zustand';

interface NodeHighlightState {
  highlightedNodeIds: Set<string>;
  highlightNode: (nodeId: string) => void;
  clearHighlight: () => void;
}

export const useNodeHighlightStore = create<NodeHighlightState>((set) => ({
  highlightedNodeIds: new Set<string>(),
  highlightNode: (nodeId: string) =>
    set((state) => {
      const newSet = new Set(state.highlightedNodeIds);
      newSet.add(nodeId);
      return { highlightedNodeIds: newSet };
    }),
  clearHighlight: () => set({ highlightedNodeIds: new Set<string>() }),
}));
