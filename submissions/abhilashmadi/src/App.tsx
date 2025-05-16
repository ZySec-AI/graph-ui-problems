import Editor from "@components/editor";
import GraphCanvas from "@components/graph-canvas";
import storageKeys from "@utils/storage-keys";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@components/ui/resizable";
import { ThemeProvider } from '@context/theme-provider';
import { TooltipProvider } from "@ui/tooltip";
import GraphyContext from "@context/graphy-context";
import { useEffect, useState } from "react";
import { seedInitialGraphsIfNeeded } from "@utils/index-db-service";

function App() {
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);

  useEffect(() => {
    const seed = async () => await seedInitialGraphsIfNeeded();
    seed();
  }, []);

  const toggleMobileEditor = () => setIsMobileEditorOpen(prev => !prev);

  return (
    <GraphyContext>
      <ThemeProvider defaultTheme="dark" storageKey={storageKeys.APP_THEME}>
        <TooltipProvider>
          {/* Mobile Header with Toggle Button */}
          <div className="md:hidden flex justify-end items-center p-2 bg-background border-b">
            <button
              className="px-3 py-1 text-sm border rounded-md hover:bg-muted"
              onClick={toggleMobileEditor}
            >
              {isMobileEditorOpen ? "Close Editor" : "Editor"}
            </button>
          </div>

          {/* Mobile View */}
          <div className="md:hidden relative h-[calc(100dvh-48px)]">
            {/* Editor Drawer */}
            {isMobileEditorOpen && (
              <div className="absolute inset-0 z-50 bg-background border-l p-4 overflow-y-auto">
                <Editor />
              </div>
            )}
            {/* Graph Canvas behind the drawer */}
            <GraphCanvas />
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
        </TooltipProvider>
      </ThemeProvider>
    </GraphyContext>
  );
}

export default App;
