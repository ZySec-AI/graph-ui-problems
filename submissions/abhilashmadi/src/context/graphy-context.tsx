import type { GraphData } from "@/schema/input-json-schema";
import {
  createContext,
  useReducer,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
} from "react";

// Define action types
type GraphAction =
  | { type: "LOAD_DATA"; payload: GraphData }
  | { type: "RESET_GRAPH" };

type MobileEditorViewState = 'show' | 'hide'

// Initial state
export const initialState: GraphData = {
  meta: {
    title: "Design or Import Your Graph Schema",
    description:
      "Create your node schema using the JSON editor, load a sample graph, or upload a JSON file to visualize the graph structure.",
  },
  nodes: [],
  edges: [],
};

// Reducer function
const graphReducer = (state: GraphData, action: GraphAction): GraphData => {
  switch (action.type) {
    case "LOAD_DATA":
      return action.payload;
    case "RESET_GRAPH":
      return initialState;
    default:
      return state;
  }
};

// Context type
interface GraphEditorContextType {
  state: GraphData;
  dispatch: Dispatch<GraphAction>;
  mobileEditor: MobileEditorViewState;
  updateMobileEditorView: (view: MobileEditorViewState) => void;
}

// Create context
export const GraphEditorContext = createContext<GraphEditorContextType | null>(null);

interface GraphyContextProps {
  children: ReactNode;
}

// Provider component
const GraphyContext: FC<GraphyContextProps> = ({ children }) => {
  const [mobileEditor, setMobileEditor] = useState<MobileEditorViewState>('hide');
  const [state, dispatch] = useReducer(graphReducer, initialState);

  const updateMobileEditorView = (view: MobileEditorViewState): void => {
    return setMobileEditor(view)
  }

  return (
    <GraphEditorContext.Provider value={{ state, dispatch, mobileEditor, updateMobileEditorView }}>
      {children}
    </GraphEditorContext.Provider>
  );
};

export default GraphyContext;
