"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Lock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { completeQuiz } from "@/src/lib/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Choice { id: string; text: string; isCorrect: boolean; }
interface Question { id: string; prompt: string; codeSnippet?: string | null; explanation?: string | null; choices: Choice[]; }

interface QuizProps {
  quizId: string;
  title: string;
  questions: Question[];
  hasPassedBefore?: boolean;
}

export function Quiz({ quizId, title, questions, hasPassedBefore = false }: QuizProps) {
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  
  const [isCompleted, setIsCompleted] = useState(hasPassedBefore);
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  const current = questions[currentIndex];
  const selectedChoiceObj = current?.choices.find((c) => c.id === selectedChoice);

  // 👇 NEW: Block guests from taking the quiz
  if (!session) {
    return (
      <Card className="border-brand-200 bg-brand-50">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-brand-900 mb-2">Want to test your knowledge?</h3>
          <p className="text-brand-700 mb-6 max-w-sm">
            Create a free account to take quizzes, earn XP, and track your learning progress.
          </p>
          <Link 
            href="/register" 
            className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Sign Up Free
          </Link>
        </CardContent>
      </Card>
    );
  }

  function handleSubmit() {
    if (!selectedChoice) return;
    setSubmitted(true);
    if (selectedChoiceObj?.isCorrect) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongQuestions((prev) => [...prev, current.id]);
    }
  }

  async function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      const finalScore = correctCount + (selectedChoiceObj?.isCorrect ? 1 : 0);
      const percent = Math.round((finalScore / questions.length) * 100);
      
      if (percent >= 70) {
         await completeQuiz(quizId, finalScore, questions.length, 15, wrongQuestions);
         router.refresh();
      }
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedChoice(null);
      setSubmitted(false);
    }
  }

  function handleRetry() {
    setIsRetrying(true);
    setIsCompleted(false);
    setFinished(false);
    setCurrentIndex(0);
    setSelectedChoice(null);
    setSubmitted(false);
    setCorrectCount(0);
    setWrongQuestions([]);
  }

  if (isCompleted && !isRetrying) {
    return (
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 mb-4" />
          <h3 className="text-xl font-bold text-emerald-900 mb-2">Quiz Passed!</h3>
          <p className="text-sm text-emerald-700 mb-6">
            You have already completed this quiz and earned your XP.
          </p>
          <Button onClick={handleRetry} variant="outline" className="bg-white">
            <RotateCcw className="mr-2 h-4 w-4" /> Retry for Practice (No XP)
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    const finalScore = correctCount;
    const percent = Math.round((finalScore / questions.length) * 100);
    const passed = percent >= 70;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-brand-600">{percent}%</div>
            <p className="mt-2 text-sm text-ink-600">
              You got {finalScore} out of {questions.length} correct
            </p>
            <p className={cn(
              "mt-4 inline-block rounded-full px-4 py-1 text-sm font-semibold",
              passed ? "bg-brand-100 text-brand-700" : "bg-amber-100 text-amber-700"
            )}>
              {passed ? "🎉 Passed!" : "Keep practicing"}
            </p>
          </div>
          <Button className="w-full" onClick={handleRetry}>
            Retake quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <span className="text-xs font-medium text-ink-500">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-ink-900">{current.prompt}</p>

          {current.codeSnippet && (
            <pre className="overflow-x-auto rounded-lg bg-ink-900 p-4 text-xs text-ink-100">
              {current.codeSnippet}
            </pre>
          )}

          <div className="space-y-2">
            {current.choices.map((choice) => {
              const isSelected = selectedChoice === choice.id;
              const showCorrect = submitted && choice.isCorrect;
              const showWrong = submitted && isSelected && !choice.isCorrect;

              return (
                <button
                  key={choice.id}
                  onClick={() => !submitted && setSelectedChoice(choice.id)}
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
                    {showCorrect ? <CheckCircle2 className="h-4 w-4" /> : showWrong ? <XCircle className="h-4 w-4" /> : String.fromCharCode(65 + current.choices.indexOf(choice))}
                  </span>
                  <span className="flex-1">{choice.text}</span>
                </button>
              );
            })}
          </div>

          {submitted && current.explanation && (
            <div className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900">
              <strong>💡 Explanation:</strong> {current.explanation}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={!selectedChoice}>Submit answer</Button>
          ) : (
            <Button onClick={handleNext}>{currentIndex + 1 >= questions.length ? "See results" : "Next question"}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}