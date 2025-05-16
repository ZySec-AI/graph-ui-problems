import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { useState, type ChangeEvent, type FC } from "react";
import { Button } from "@ui/button";
import { File } from "lucide-react";
import { Input } from "@ui/input";
import { graphStorageInstance } from "@utils/index-db-service";
import useGraphyEditorContext from "@/hooks/use-graphy-store";

const SaveGraphDialog: FC = () => {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const { state } = useGraphyEditorContext();

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = async () => {
    try {
      await graphStorageInstance.save({ title, id: Date.now(), data: state });
      setTitle("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to save graph:", error);
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline">
              <File />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">Save Graph</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Current Graph!</DialogTitle>
          <DialogDescription className="space-y-6">
            <p>Give your graph a name and save it to IndexedDB.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Graph title..."
                value={title}
                onChange={handleTitleChange}
              />
              <Button onClick={handleSave} disabled={!title.trim()}>
                Save
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SaveGraphDialog;
