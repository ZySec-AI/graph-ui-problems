import { configureStore } from '@reduxjs/toolkit';
import editorSlice from "@redux/features/editor";

const store = configureStore({
  reducer: {
    [editorSlice.reducerPath]: editorSlice.reducer,
  },
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch