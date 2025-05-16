import { type FC } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { Button } from "@ui/button";
import ThemeSwitch from "@components/common/theme-switch";
import SaveGraphDialog from "@components/save-graph-dialog";
import { Code, ImageDown } from "lucide-react";
import useGraphyEditorContext from "@/hooks/use-graphy-store";

interface IGraphToolbox {
  onSaveSvgClick: () => void;
}

const GraphToolbox: FC<IGraphToolbox> = ({ onSaveSvgClick }) => {
  const { theme } = useTheme();
  const { mobileEditor, updateMobileEditorView } = useGraphyEditorContext();

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
      <Tooltip>
        <TooltipTrigger asChild className="md:hidden">
          <Button size="icon" variant="outline" className="bg-orange-500" onClick={() => updateMobileEditorView('show')}><Code /></Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          {mobileEditor ? "Close Editor" : "Editor"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default GraphToolbox;
