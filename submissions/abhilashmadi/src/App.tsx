import Editor from "@components/editor";
import GraphCanvas from "@components/graph-canvas";
import store from '@redux/store';
import storageKeys from "@utils/storage-keys";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@components/ui/resizable";
import { ThemeProvider } from '@context/theme-provider';
import { TooltipProvider } from "@ui/tooltip";
import '@xyflow/react/dist/style.css';
import { Provider } from "react-redux";

function App() {

  return (<Provider store={store}>
    <ThemeProvider defaultTheme="dark" storageKey={storageKeys.APP_THEME}>
      <TooltipProvider>
        <ResizablePanelGroup direction="horizontal" className="min-h-dvh w-full">
          <ResizablePanel minSize={20} maxSize={30}>
            <Editor />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <GraphCanvas />
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </ThemeProvider>
  </Provider>)
}

export default App
