import { useTheme } from "@/hooks/use-theme";
import ThemeSwitch from "@components/common/theme-switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { type FC } from "react";
import SaveGraphDialog from "./save-graph-dialog";

const GraphToolbox: FC = () => {
  const { theme } = useTheme();

  return (
    <div className="absolute top-8 right-8 flex gap-2 flex-col">
      <Tooltip>
        <TooltipTrigger>
          <ThemeSwitch />
        </TooltipTrigger>
        <TooltipContent side="left">
          {theme === 'dark' ? <>Switch to Light</> : <>Switch to Dark</>}
        </TooltipContent>
      </Tooltip>
      <SaveGraphDialog />
    </div>
  );
};

export default GraphToolbox;
