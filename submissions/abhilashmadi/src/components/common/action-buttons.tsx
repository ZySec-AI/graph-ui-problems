import { Edit2, Eye, Trash } from "lucide-react";
import {
  createContext,
  useContext,
  type FC,
  type ReactNode,
} from "react";

type ActionContextProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const ActionContext = createContext<ActionContextProps | null>(null);

const useActionContext = () => {
  const ctx = useContext(ActionContext);
  if (!ctx) throw new Error("Must use within <ActionButton>");
  return ctx;
};

type ActionButtonProps = {
  children: ReactNode;
} & ActionContextProps;

// Subcomponents
const View: FC = () => {
  const { onView } = useActionContext();
  return (
    <button className="p-2 size-7" onClick={onView} title="View">
      <Eye className="size-3" />
    </button>
  );
};

const Edit: FC = () => {
  const { onEdit } = useActionContext();
  return (
    <button className="p-2 size-7" onClick={onEdit} title="Edit">
      <Edit2 className="size-3" />
    </button>
  );
};

const Delete: FC = () => {
  const { onDelete } = useActionContext();
  return (
    <button className="p-2 size-7 bg-red-500" onClick={onDelete} title="Delete">
      <Trash className="size-3" />
    </button>
  );
};

// Define base component
const BaseActionButton: FC<ActionButtonProps> = ({ children, ...handlers }) => {
  return (
    <ActionContext.Provider value={handlers}>
      <div className="bg-muted-foreground rounded overflow-hidden text-background divide-x shadow-md">{children}</div>
    </ActionContext.Provider>
  );
};

// Extend the base component with static subcomponents
const ActionButton = Object.assign(BaseActionButton, {
  View,
  Edit,
  Delete,
});

export default ActionButton;
