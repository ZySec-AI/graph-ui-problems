import { create } from 'zustand';
import type { Node } from 'reactflow';

interface NodePopupState {
  selectedNode: Node | null;
  selectedNodeId: string | null;
  setSelectedNode: (node: Node | null) => void;
}

export const useNodePopupStore = create<NodePopupState>((set) => ({
  selectedNode: null,
  selectedNodeId: null,
  setSelectedNode: (node) =>
    set({
      selectedNode: node,
      selectedNodeId: node?.id || null,
    }),
}));
