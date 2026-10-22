"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Terminal, Save } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { runPython } from "@/src/lib/pyodide";

export default function PlaygroundPage() {
  const [code, setCode] = useState(`# Welcome to the Python Playground!\n# Write any Python code here and click "Run".\n\nprint("Hello, Playground!")\n`);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    setOutput("Loading Python runtime...");

    try {
      const result = await runPython(code);
      setOutput(result);
    } catch (err: any) {
      setOutput("❌ " + (err.message || String(err)));
    } finally {
      setRunning(false);
    }
  }

  function handleSave() {
    localStorage.setItem("playground-code", code);
    alert("Code saved locally!");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 md:-m-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3">
        <div>
          <h1 className="text-lg font-bold text-ink-900 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-brand-600" />
            Python Playground
          </h1>
          <p className="text-xs text-ink-500">Test your code freely in this open environment.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} className="hidden md:flex">
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
          <Button size="sm" onClick={handleRun} disabled={running} className="bg-brand-600 hover:bg-brand-700 text-white">
            {running ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Running...</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Run Code</>
            )}
          </Button>
        </div>
      </div>

      {/* Editor and Output split */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        {/* Editor */}
        <div className="flex-1 border-r border-ink-200 relative">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(v) => setCode(v || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="w-full lg:w-1/3 flex flex-col bg-ink-900 text-ink-100">
          <div className="flex items-center justify-between px-4 py-2 bg-ink-800 border-b border-ink-700">
            <span className="text-xs font-medium text-ink-300 flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5" />
              Terminal Output
            </span>
          </div>
          <pre className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {output || "Run your code to see the output here."}
          </pre>
        </div>

      </div>
    </div>
  );
}