"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, CheckCircle2, XCircle, Loader2, Award, Sparkles, RotateCcw, Lock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { completeMission } from "@/src/lib/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function MissionWorkspace({
  missionId,
  initialCode,
  savedCode,
  isCompleted,
  xpReward,
  description,
}: any) {
  const { data: session } = useSession();
  const [code, setCode] = useState(isCompleted ? savedCode : initialCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; feedback: string } | null>(null);
  const [hasPassedNow, setHasPassedNow] = useState(isCompleted);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const router = useRouter();
  const storageKey = `mission-${missionId}`;

  // 👇 NEW: Block guests
  if (!session) {
    return (
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600 mx-auto mb-4">
          <Lock className="h-7 w-7" />
        </div>
        <h3 className="text-2xl font-bold text-brand-900 mb-2">Ready to solve this challenge?</h3>
        <p className="text-brand-700 mb-6 max-w-md mx-auto">
          Create a free account to write code, submit your solution, and earn XP.
        </p>
        <Link 
          href="/register" 
          className="inline-block rounded-lg bg-brand-600 px-8 py-3 text-sm font-medium text-white hover:bg-brand-700"
        >
          Sign Up to Start Coding
        </Link>
      </div>
    );
  }

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
        body: JSON.stringify({ code, missionDescription: description }),
      });

      const data = await res.json();
      
      if (data.error) {
        setResult({ passed: false, feedback: data.error });
      } else {
        setResult(data);
        if (data.passed) {
          setHasPassedNow(true);
          await completeMission(missionId, xpReward, code);
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
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Mission Completed!</h2>
          <p className="text-emerald-700 mb-6">
            You have already solved this challenge. Your code and XP are saved.
          </p>
          <Button onClick={handleRetry} variant="outline" className="bg-white">
            <RotateCcw className="mr-2 h-4 w-4" /> Retry for Practice (No XP)
          </Button>
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
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> AI is grading your code...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" /> Submit to AI Grader</>
          )}
        </Button>

        {result && (
          <div className={`rounded-xl border p-4 ${result.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <div className="flex items-center gap-2 font-bold text-lg mb-2">
              {result.passed ? (
                <><CheckCircle2 className="text-emerald-600 h-6 w-6" /> Mission Accomplished!</>
              ) : (
                <><XCircle className="text-rose-600 h-6 w-6" /> Try Again</>
              )}
            </div>
            
            <p className="text-sm text-ink-700 mb-3">{result.feedback}</p>
            
            {result.passed && (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-100 p-2 rounded">
                <Award className="h-4 w-4" /> You earned {xpReward} XP!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}