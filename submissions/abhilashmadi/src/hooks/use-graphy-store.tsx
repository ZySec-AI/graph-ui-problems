import { useContext } from "react";
import { GraphEditorContext } from "@context/graphy-context";
import type { Graph } from "@/schema/input-json-schema";

const useGraphyEditorContext = () => {
  const context = useContext(GraphEditorContext);

  if (!context) throw new Error("useGraphyEditorContext must be used within a GraphyContext provider");

  const { state, dispatch } = context;

  return {
    state,
    dispatch,
    updateData: (data: Graph) => dispatch({ type: "LOAD_DATA", payload: data }),
    resetGraph: () => dispatch({ type: "RESET_GRAPH" }),
  };
};

export default useGraphyEditorContext;
