import { useAppDispatch, useAppSelector } from "@hooks/redux-hooks";
import editorSlice from "@/redux/features/editor";

export default function useEditorStore() {
  const { data } = useAppSelector((s) => s.editor)
  const dispatch = useAppDispatch();
  const { updateData } = editorSlice.actions;

  return {
    data,
    updateData: (data: object) => dispatch(updateData(data))
  }
}