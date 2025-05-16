import { useTheme } from "@hooks/use-theme";
import { graphSchema, type GraphData } from "@schema/input-json-schema";
import { Button } from "@ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui/tooltip";
import { DatabaseBackup, Eraser, FileInput, Workflow } from "lucide-react";
import { type FC, useRef, useState } from "react";
import ReactJson, { type InteractionProps } from "react-json-view";
import { z } from "zod";
import useGraphyEditorContext from "@/hooks/use-graphy-store";
import SavedGraphsDialog from "./saved-graphs-dialog";

const Editor: FC = () => {
  const { theme } = useTheme();
  const {
    state,
    resetGraph,
    updateData,
    updateMobileEditorView,
  } = useGraphyEditorContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load sample graph data
  const handleLoadSampleData = async (): Promise<void> => {
    try {
      setErrorMsg(null);
      const module = await import("@/resources/sample-1.json");
      updateData(module.default as GraphData);
    } catch (error) {
      console.error("Error loading JSON:", error);
      setErrorMsg("Failed to load sample data.");
    }
  };

  // Parse uploaded JSON file and validate
  const handleChooseFile = async (): Promise<void> => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        const validated = graphSchema.parse(json);
        updateData(validated);
        setErrorMsg(null);
      } catch (error) {
        if (error instanceof SyntaxError) {
          setErrorMsg("Invalid JSON syntax.");
        } else if (error instanceof z.ZodError) {
          const messages = error.errors
            .map((e) => `• ${e.path.join(".")}: ${e.message}`)
            .join("\n");
          setErrorMsg(
            `Validation failed for input file: ${file.name}\n${messages}`
          );
        } else {
          setErrorMsg("An unknown error occurred.");
        }
        console.error("File read/validation error:", error);
      }
    };

    reader.onerror = (error) => {
      setErrorMsg("Error reading file.");
      console.error("FileReader error:", error);
    };

    reader.readAsText(file);
  };

  // Reset editor state
  const handleClearInput = () => {
    resetGraph();
    setErrorMsg(null);
  };

  // JSON editor interaction handlers
  const handleJsonChange = (change: InteractionProps) => {
    if (change.updated_src) {
      updateData(change.updated_src as GraphData);
    }
  };

  return (
    <aside className="h-dvh flex flex-col gap-2 p-2">
      {/* Document Meta */}
      <div className="basis-[5%] p-2 shadow rounded border bg-editor space-y-1">
        <h2 className="text-blue-400 text-sm font-medium">
          {state?.meta?.title}
        </h2>
        <p
          className="text-xs font-mono line-clamp-3"
          title={state?.meta?.description}
        >
          {state?.meta?.description}
        </p>
      </div>

      {/* Editor */}
      <section className="flex-1 basis-[90%] shadow rounded p-2 border overflow-y-auto bg-editor">
        <ReactJson
          src={state}
          onEdit={handleJsonChange}
          onAdd={handleJsonChange}
          onDelete={handleJsonChange}
          theme={
            theme === "dark" || theme === "system"
              ? "ocean"
              : "bright:inverted"
          }
          displayDataTypes={false}
          enableClipboard={false}
          collapsed={false}
          style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
        />
      </section>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleChooseFile}
        className="hidden"
      />

      {/* JSON Validation Message */}
      {errorMsg && (
        <div className="text-xs p-2 bg-red-50 dark:bg-red-950 dark:text-red-200 rounded border-dashed whitespace-pre-wrap text-red-500 shadow border border-red-400">
          {errorMsg}
        </div>
      )}

      {/* Action Buttons */}
      <div className="basis-[5%] p-2 shadow rounded border flex gap-2 bg-editor justify-between">
        <div className="space-x-2">
          {/* Choose File */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                aria-label="Choose JSON file"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileInput aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Choose File</TooltipContent>
          </Tooltip>

          {/* Load Sample */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                aria-label="Load sample data"
                onClick={handleLoadSampleData}
              >
                <DatabaseBackup aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load Sample Data</TooltipContent>
          </Tooltip>

          {/* Saved Graphs */}
          <SavedGraphsDialog />

          {/* Clear Input */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                aria-label="Clear input data"
                onClick={handleClearInput}
              >
                <Eraser aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Input Data</TooltipContent>
          </Tooltip>
        </div>

        {/* Show Graph Canvas */}
        <Button
          size="icon"
          aria-label="Show graph canvas"
          className="md:hidden"
          onClick={() => updateMobileEditorView("hide")}
        >
          <Workflow aria-hidden="true" />
        </Button>
      </div>
    </aside>
  );
};

export default Editor;
