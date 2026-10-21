"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Sparkles, Loader2, CheckCircle2, XCircle, Award, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ProjectWorkspace({ 
  projectId, 
  projectSlug, 
  title, 
  initialCode, 
  savedCode,
  isCompleted,
  requirements 
}: any) {
  const [code, setCode] = useState(isCompleted ? savedCode : initialCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; feedback: string } | null>(null);
  const [hasPassedNow, setHasPassedNow] = useState(isCompleted);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const router = useRouter();
  const reqs = JSON.parse(requirements).map((r: any) => r.description).join(", ");
  const storageKey = `project-${projectId}`;

  useEffect(() => {
    if (!isCompleted) {
      const saved = localStorage.getItem(storageKey);
      if (saved) setCode(saved);
    }
  }, [storageKey, isCompleted]);

  function handleCodeChange(value: string | undefined) {
    const newCode = value || "";
    setCode(newCode);
    if (!isCompleted) {
      localStorage.setItem(storageKey, newCode);
    }
  }

  async function handleTest() {
    setRunning(true);
    setResult(null);

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code, 
          missionDescription: `Project: ${title}. Requirements: ${reqs}. The code must be correct and complete.` 
        }),
      });

      const data = await res.json();
      setResult(data);

      if (data.passed) {
        setHasPassedNow(true);
        const saveRes = await fetch("/api/project-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, code }),
        });
        
        if (saveRes.ok) {
          localStorage.removeItem(storageKey);
          router.refresh();
        }
      }
    } catch (e) {
      setResult({ passed: false, feedback: "Network error. Please try again." });
    } finally {
      setRunning(false);
    }
  }

  function handleRetry() {
    setIsRetrying(true);
    setHasPassedNow(false);
    setResult(null);
    setCode(initialCode);
    localStorage.setItem(storageKey, initialCode);
  }

  if (hasPassedNow && !isRetrying) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
          <Trophy className="mx-auto h-16 w-16 text-emerald-600 mb-4" />
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Project Completed! 🎉</h2>
          <p className="text-emerald-700 mb-8 max-w-lg mx-auto">
            You have successfully submitted this project. Your code has been saved and your certificate is ready.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href={`/projects/${projectSlug}/certificate`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Award className="mr-2 h-4 w-4" /> View Certificate
              </Button>
            </Link>
            <Button onClick={handleRetry} variant="outline" className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100">
              <RotateCcw className="mr-2 h-4 w-4" /> Retry for Practice
            </Button>
          </div>
        </div>
        
        <div className="h-[400px] overflow-hidden rounded-xl border border-ink-200 shadow-sm opacity-80 pointer-events-none">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            theme="vs-dark"
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-[400px] lg:h-[500px] overflow-hidden rounded-xl border border-ink-200 shadow-sm">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Button onClick={handleTest} disabled={running} size="lg" className="w-full">
          {running ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> AI is reviewing your project...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" /> Submit Project for Review</>
          )}
        </Button>

        {result && (
          <div className={`rounded-xl border p-4 ${result.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <div className="flex items-center gap-2 font-bold text-lg mb-2">
              {result.passed ? (
                <><CheckCircle2 className="text-emerald-600 h-6 w-6" /> Project Passed!</>
              ) : (
                <><XCircle className="text-rose-600 h-6 w-6" /> Needs Improvement</>
              )}
            </div>
            <p className="text-sm text-ink-700 mb-3">{result.feedback}</p>
            {result.passed && (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-100 p-2 rounded">
                <Award className="h-4 w-4" /> Certificate Generated! Refresh to view.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}