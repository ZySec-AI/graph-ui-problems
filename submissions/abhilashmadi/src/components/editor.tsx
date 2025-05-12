import useEditorStore from "@/hooks/use-app-store";
import { InputJsonSchema } from "@schema/input-json-schema";
import { useTheme } from '@hooks/use-theme';
import { Button } from "@ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@ui/tooltip";
import { DatabaseBackup, Eraser, FileInput } from "lucide-react";
import { type FC, useRef, useState } from "react";
import ReactJson, { type InteractionProps } from "react-json-view";
import { z } from "zod";


const Editor: FC = () => {
  const { theme } = useTheme();
  const { data, updateData } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoadSampleData = async (): Promise<void> => {
    try {
      setErrorMsg(null);
      const module = await import("@/resources/sample.json");
      updateData(module.default);
    } catch (error) {
      console.error("Error loading JSON:", error);
      throw error;
    }
  };



  const handleChooseFile = async (): Promise<void> => {
    if (!fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        const validated = InputJsonSchema.parse(json);

        updateData(validated);
        setErrorMsg(null);
      } catch (error) {
        if (error instanceof SyntaxError) {
          setErrorMsg("Invalid JSON syntax.");
          console.error("Invalid JSON syntax:", error);
        } else if (error instanceof z.ZodError) {
          const messages = error.errors.map((e) => `• ${e.path.join(".")}: ${e.message}`).join("\n");
          setErrorMsg(`Validation failed for input file: ${file.name}\n ${messages}`);
          console.error("Validation failed:\n ", error.errors);
        } else {
          setErrorMsg("An unknown error occurred.");
          console.error("Unknown error:", error);
        }
      }
    };

    reader.onerror = (error) => {
      setErrorMsg("Error reading file.");
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);
  };

  const handleClearInput = () => {
    updateData({});
    setErrorMsg(null);
  }

  const handleEdit = (edit: InteractionProps) => {
    if (edit.updated_src) updateData(edit.updated_src);
  };

  const handleAdd = (add: InteractionProps) => {
    if (add.updated_src) updateData(add.updated_src);
  };

  const handleDelete = (del: InteractionProps) => {
    if (del.updated_src) updateData(del.updated_src);
  };

  return (
    <aside className="h-dvh flex flex-col gap-2 p-2">
      {/* DOCUMENT META */}
      <div className="basis-[5%] p-2 shadow rounded border bg-editor space-y-1">
        <h2 className="text-primary text-sm font-medium">{data?.meta?.title}</h2>
        <p className="text-xs font-mono">{data?.meta?.description}</p>
      </div>

      {/* EDITOR */}
      <section className="flex-1 basis-[90%] shadow rounded p-2 border overflow-y-auto bg-editor">
        <ReactJson
          src={data}
          onEdit={handleEdit}
          onAdd={handleAdd}
          onDelete={handleDelete}
          theme={theme === 'dark' ? 'ocean' : 'bright:inverted'}
          displayDataTypes={false}
          enableClipboard={false}
          collapsed={false}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
        />
      </section>

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleChooseFile}
        className="hidden"
      />

      {/* JSON VALIDATION MESSAGE */}
      {errorMsg && (
        <div className="text-xs p-2 bg-red-50 dark:bg-red-950 dark:text-red-200 rounded border-dashed whitespace-pre-wrap text-red-500 shadow border border-red-400">
          {errorMsg}
        </div>
      )}

      {/* BUTTONS */}
      <div className="basis-[5%] p-2 shadow rounded border flex gap-2 bg-editor">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" onClick={() => fileInputRef.current?.click()}>
              <FileInput />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Choose File</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline"
              onClick={handleLoadSampleData}
            // disabled={Object.keys(data).length !== 0}
            >
              <DatabaseBackup />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Load Sample Data</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" onClick={handleClearInput} variant="destructive">
              <Eraser />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear Input Data</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
};

export default Editor;
