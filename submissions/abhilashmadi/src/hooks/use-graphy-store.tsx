import { useContext } from "react";
import { GraphEditorContext } from "@context/graphy-context";
import type { GraphData } from "@/schema/input-json-schema";

const useGraphyEditorContext = () => {
  const context = useContext(GraphEditorContext);

  if (!context) throw new Error("useGraphyEditorContext must be used within a GraphyContext provider");

  const { state, dispatch, mobileEditor, updateMobileEditorView } = context;

  return {
    state,
    dispatch,
    updateData: (data: GraphData) => dispatch({ type: "LOAD_DATA", payload: data }),
    resetGraph: () => dispatch({ type: "RESET_GRAPH" }),
    mobileEditor,
    updateMobileEditorView,
  };
};

export default useGraphyEditorContext;
