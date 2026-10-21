"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { useRouter } from "next/navigation";

export function RevisionQuiz({ items }: { items: any[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const current = items[index];
  const selectedObj = current.question.choices.find((c: any) => c.id === selected);

  function handleNext() {
    if (index + 1 >= items.length) {
      router.refresh();
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between text-xs font-medium text-ink-500 mb-2">
          <span>Question {index + 1} of {items.length}</span>
        </div>
        
        <p className="text-lg font-medium text-ink-900">{current.question.prompt}</p>

        {current.question.codeSnippet && (
          <pre className="rounded-lg bg-ink-900 p-4 text-xs text-ink-100 overflow-x-auto">
            {current.question.codeSnippet}
          </pre>
        )}

        <div className="space-y-2 mt-4">
          {current.question.choices.map((choice: any) => {
            const isSelected = selected === choice.id;
            const showCorrect = submitted && choice.isCorrect;
            const showWrong = submitted && isSelected && !choice.isCorrect;

            return (
              <button
                key={choice.id}
                onClick={() => !submitted && setSelected(choice.id)}
                disabled={submitted}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition",
                  !submitted && !isSelected && "border-ink-200 hover:border-brand-300 hover:bg-brand-50/40",
                  !submitted && isSelected && "border-brand-500 bg-brand-50",
                  showCorrect && "border-emerald-500 bg-emerald-50",
                  showWrong && "border-rose-500 bg-rose-50",
                  submitted && !showCorrect && !showWrong && "border-ink-200 opacity-60"
                )}
              >
                <span className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  isSelected && !submitted && "border-brand-500 bg-brand-500 text-white",
                  !isSelected && !submitted && "border-ink-300 text-ink-500",
                  showCorrect && "border-emerald-500 bg-emerald-500 text-white",
                  showWrong && "border-rose-500 bg-rose-500 text-white"
                )}>
                  {showCorrect ? <CheckCircle2 className="h-4 w-4" /> : showWrong ? <XCircle className="h-4 w-4" /> : String.fromCharCode(65 + current.question.choices.indexOf(choice))}
                </span>
                <span className="flex-1">{choice.text}</span>
              </button>
            );
          })}
        </div>

        {submitted && current.question.explanation && (
          <div className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900 mt-4">
            <strong>💡 Explanation:</strong> {current.question.explanation}
          </div>
        )}

        <div className="flex justify-end mt-6">
          {!submitted ? (
            <Button onClick={() => setSubmitted(true)} disabled={!selected}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {index + 1 >= items.length ? "Finish Review" : "Next Question"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}