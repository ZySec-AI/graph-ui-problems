import Editor from "@components/editor";
import GraphCanvas from "@components/graph-canvas";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@components/ui/resizable";
import { seedInitialGraphsIfNeeded } from "@utils/index-db-service";
import { useEffect } from "react";
import useGraphyEditorContext from "./hooks/use-graphy-store";

function App() {
  const { mobileEditor } = useGraphyEditorContext();

  useEffect(() => {
    const seed = async () => await seedInitialGraphsIfNeeded();
    seed();
  }, []);

  return (<>
    <div className="md:hidden relative h-[calc(100dvh-48px)]">
      {/* Mobile View Drawer */}
      {mobileEditor == 'show' ? <Editor /> : <GraphCanvas />}
    </div>

    {/* Desktop View */}
    <div className="hidden md:block min-h-dvh w-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-dvh w-full">
        <ResizablePanel minSize={20} maxSize={30}>
          <Editor />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <GraphCanvas />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </>);
}

export default App;
