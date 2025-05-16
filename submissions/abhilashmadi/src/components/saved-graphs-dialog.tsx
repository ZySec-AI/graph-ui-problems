import useGraphyEditorContext from "@/hooks/use-graphy-store";
import { formatToIndianDateTime } from '@/utils/time-utils';
import ActionButton from '@components/common/action-buttons';
import { type GraphDataDbDoc } from '@schema/graph-data-doc-schema';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/tooltip';
import { graphStorageInstance } from '@utils/index-db-service';
import { CalendarArrowUp, FileClock } from 'lucide-react';
import { memo, useCallback, useEffect, useState, type FC } from 'react';
import no_files_img from '@/assets/no-files.png';

interface IGraphActionDocProps {
  doc: Omit<GraphDataDbDoc, 'data'>;
  onDeletePress: (id: number) => Promise<void>;
  onViewPress: (id: number) => Promise<void>,
}

const GraphActionDoc: FC<IGraphActionDocProps> = memo((props) => {
  const { doc, onDeletePress, onViewPress } = props;
  const { id, title } = doc;

  return (
    <li className="p-3 rounded-md bg-secondary border border-border space-y-4 shadow-sm flex flex-col justify-between">
      <div className="space-y-1">
        <h5 className="text-sm font-medium line-clamp-2" title={title}>
          {title}
        </h5>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <CalendarArrowUp className="size-3" />
          <span>{formatToIndianDateTime(Date.now())}</span>
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <ActionButton
          onDelete={() => onDeletePress(id)}
          onView={() => onViewPress(id)}>
          <ActionButton.View />
          {/* <ActionButton.Edit /> */}
          <ActionButton.Delete />
        </ActionButton>
      </div>
    </li>
  );
});

const SavedGraphsDialog: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Pick<GraphDataDbDoc, 'id' | 'title'>[]>([]);

  const { dispatch } = useGraphyEditorContext();

  const fetchData = async () => {
    const savedGraphs = await graphStorageInstance.getAllProjections(['title', 'id']);
    setData(savedGraphs);
  };

  const onDeletePress = useCallback(async (id: number) => {
    await graphStorageInstance.delete(id);
    await fetchData();
  }, [])

  const onViewPress = useCallback(async (id: number) => {
    const doc = await graphStorageInstance.getProjection(id, ['data']);
    dispatch({ type: "LOAD_DATA", payload: doc?.data as GraphDataDbDoc['data'] })
    setOpen(false);
  }, [dispatch])

  useEffect(() => {
    if (!open) return;
    fetchData();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline" aria-label="Saved graphs">
              <FileClock className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>View Saved Graphs</TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Saved Graphs</DialogTitle>
          <DialogDescription>
            These are your previously saved graph states. You can load, edit, or permanently delete them.
          </DialogDescription>
        </DialogHeader>

        {data.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {data?.map((o) => <GraphActionDoc
              key={o.id}
              doc={o}
              onDeletePress={onDeletePress}
              onViewPress={onViewPress} />)}
          </ul>)
          : (<div className="text-center flex flex-col items-center min-h-max">
            <img
              src={no_files_img}
              height={100}
              width={100}
              className="block" />
            <h3>No files saved yet!</h3>
          </div>)}
      </DialogContent>
    </Dialog>
  );
};

export default SavedGraphsDialog;
