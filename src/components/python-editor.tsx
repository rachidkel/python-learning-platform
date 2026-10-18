"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Terminal, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { runPython } from "@/src/lib/pyodide";

interface PythonEditorProps {
  initialCode?: string;
  onSuccess?: (output: string) => void;
}

export function PythonEditor({ initialCode, onSuccess }: PythonEditorProps) {
  const [code, setCode] = useState(
    initialCode || `# Write your Python code here\nprint("Hello, World!")\n`
  );
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  async function handleRun() {
    setRunning(true);
    setOutput("Loading Python runtime…");

    try {
      const result = await runPython(code);
      setOutput(result);
      onSuccess?.(result);
    } catch (err: any) {
      setOutput("❌ " + (err.message || String(err)));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div
      className={
        isExpanded
          ? "fixed inset-4 z-50 flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-2xl"
          : "overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card"
      }
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-ink-200 bg-ink-50 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-ink-600">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          main.py
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button size="sm" onClick={handleRun} disabled={running}>
            {running ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className={isExpanded ? "flex-1" : "h-[300px]"}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={(v) => setCode(v || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
          }}
        />
      </div>

      {/* Output */}
      <div className="shrink-0 border-t border-ink-200 bg-ink-900 text-ink-100">
        <div className="flex items-center gap-2 border-b border-ink-800 px-4 py-2 text-xs font-medium text-ink-400">
          <Terminal className="h-3.5 w-3.5" />
          Output
        </div>
        <pre
          className={`overflow-auto whitespace-pre-wrap px-4 py-3 font-mono text-xs leading-relaxed ${
            isExpanded ? "max-h-[200px]" : "min-h-[80px] max-h-[120px]"
          }`}
        >
          {output || "Click Run to see output."}
        </pre>
      </div>
    </div>
  );
}