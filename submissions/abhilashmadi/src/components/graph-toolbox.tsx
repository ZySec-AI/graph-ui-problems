import { type FC } from "react";
import ThemeSwitch from "@components/common/theme-switch";

const GraphToolbox: FC = () => {
  return (
    <div className="absolute top-8 right-8 flex gap-2 flex-col">
      <ThemeSwitch />
    </div>
  );
};

export default GraphToolbox;
