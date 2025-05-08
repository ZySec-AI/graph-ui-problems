import { create } from 'zustand'

type LayoutMode = 'column' | 'random'

interface LayoutState {
  layoutMode: LayoutMode
  toggleLayout: () => void
}

export const useLayoutStore = create<LayoutState>((set) => ({
  layoutMode: 'column',
  toggleLayout: () =>
    set((state) => ({
      layoutMode: state.layoutMode === 'column' ? 'random' : 'column',
    })),
}))
