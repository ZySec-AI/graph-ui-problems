import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IEditorSliceInitialState {
  data: object;
}

const initialState = {
  data: {
    nodes: [],
    edges: [],
  }
} satisfies IEditorSliceInitialState;

const editorSlice = createSlice({
  initialState,
  name: 'editor',
  reducers: {
    updateData: (state, action: PayloadAction<object>) => { state.data = action.payload }
  },
})

export default editorSlice;