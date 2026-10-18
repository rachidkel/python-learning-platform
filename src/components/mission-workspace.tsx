"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { runTests } from "@/src/lib/pyodide";
import { awardQuizXp } from "@/src/lib/actions"; // Reuse XP function

export function MissionWorkspace({ missionId, initialCode, tests, xpReward }: any) {
  const [code, setCode] = useState(initialCode);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  async function handleTest() {
    setRunning(true);
    setResults(null);
    try {
      const res = await runTests(code, tests);
      setResults(res);
      
      // If all passed, award XP!
      if (res.every((r: any) => r.passed)) {
         await awardQuizXp(xpReward, `MISSION_${missionId}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="h-[500px] border rounded-xl overflow-hidden shadow-sm">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={(v) => setCode(v || "")}
          theme="vs-dark"
        />
      </div>

      {/* Test Results Panel */}
      <div className="flex flex-col gap-4">
        <Button onClick={handleTest} disabled={running} size="lg" className="w-full">
          {running ? "Running Tests..." : "▶ Submit for Testing"}
        </Button>

        {results && (
          <div className="rounded-xl border bg-white p-4">
            <h3 className="font-bold mb-4">Test Results</h3>
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className={`p-3 rounded-lg border ${r.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  <div className="flex items-center gap-2 font-medium">
                    {r.passed ? <CheckCircle2 className="text-emerald-600 h-5 w-5" /> : <XCircle className="text-rose-600 h-5 w-5" />}
                    Test {i + 1}: {r.passed ? "Passed" : "Failed"}
                  </div>
                  {!r.passed && (
                    <div className="mt-2 text-sm font-mono bg-white p-2 rounded border">
                      <div className="text-rose-600">Expected: {r.expected}</div>
                      <div className="text-ink-600">Actual: {r.actual}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}