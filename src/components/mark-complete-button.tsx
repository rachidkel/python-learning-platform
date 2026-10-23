"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { markLessonComplete } from "@/src/lib/actions";

export function MarkCompleteButton({
  lessonId,
  slug,
  completed,
}: {
  lessonId: string;
  slug: string;
  completed: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 👇 NEW: If not logged in, show sign-up prompt
  if (!session) {
    return (
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-brand-900">Create a free account to save your progress</h3>
            <p className="text-sm text-brand-700">Track your XP, finish lessons, and earn certificates.</p>
          </div>
        </div>
        <Link 
          href={`/register?callbackUrl=/lessons/${slug}`} 
          className="shrink-0 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Sign Up Free
        </Link>
      </div>
    );
  }

  async function handleClick() {
    setLoading(true);
    try {
      await markLessonComplete(lessonId, slug);
      router.refresh();
      setTimeout(() => {
        window.location.reload();
      }, 500);
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