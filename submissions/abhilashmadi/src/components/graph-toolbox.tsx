import { type FC } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { Button } from "@ui/button";
import ThemeSwitch from "@components/common/theme-switch";
import SaveGraphDialog from "@components/save-graph-dialog";
import { ImageDown } from "lucide-react";

interface IGraphToolbox {
  onSaveSvgClick: () => void;
}

const GraphToolbox: FC<IGraphToolbox> = ({ onSaveSvgClick }) => {
  const { theme } = useTheme();

  return (
    <div className="absolute top-8 right-8 flex gap-2 flex-col">
      <Tooltip>
        <TooltipTrigger asChild>
          <ThemeSwitch />
        </TooltipTrigger>
        <TooltipContent side="left">
          {theme === 'dark' ? <>Switch to Light</> : <>Switch to Dark</>}
        </TooltipContent>
      </Tooltip>
      <SaveGraphDialog />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline" onClick={onSaveSvgClick}><ImageDown /></Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          Save as SVG
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default GraphToolbox;
