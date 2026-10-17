"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

interface MarkCompleteButtonProps {
  lessonId: string;
  slug: string;
  completed: boolean;
}

export function MarkCompleteButton({
  lessonId,
  slug,
  completed,
}: MarkCompleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const { markLessonComplete } = await import("../app/(dashboard)/lessons/[slug]/actions");
      await markLessonComplete(lessonId, slug);
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700">
        <CheckCircle2 className="h-4 w-4" />
        Lesson completed
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving…
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Mark as complete
        </>
      )}
    </button>
  );
}