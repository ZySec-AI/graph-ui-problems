import { create } from 'zustand';
import type { GraphData } from '../types/graph';

interface SampleModalState {
  isOpen: boolean;
  onSelect?: (data: GraphData) => void;
  open: (onSelect: (data: GraphData) => void) => void;
  close: () => void;
}

export const useSampleModalStore = create<SampleModalState>((set) => ({
  isOpen: false,
  onSelect: undefined,
  open: (onSelect) => set({ isOpen: true, onSelect }),
  close: () => set({ isOpen: false, onSelect: undefined }),
}));
