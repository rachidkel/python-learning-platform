import { Suspense } from "react";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { RevisionQuiz } from "@/src/components/revision-quiz";
import { RefreshCw } from "lucide-react";

async function RevisionList() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const items = await prisma.revisionItem.findMany({
    where: {
      userId: session.user.id,
      nextReviewAt: { lte: new Date() },
    },
    include: {
      question: {
        include: { choices: true },
      },
    },
    take: 10,
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-ink-300 bg-white p-12 text-center">
        <RefreshCw className="mx-auto mb-3 h-10 w-10 text-ink-400" />
        <h2 className="text-xl font-bold text-ink-900">All caught up!</h2>
        <p className="mt-2 text-sm text-ink-500">
          You have no questions to review today. Come back tomorrow!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Smart Revision</h1>
        <p className="mt-1 text-ink-600">
          Review these {items.length} questions to strengthen your memory.
        </p>
      </div>
      
      <RevisionQuiz items={items} />
    </div>
  );
}

export default function RevisionPage() {
  return (
    <Suspense fallback={<div className="text-ink-500">Loading revision…</div>}>
      <RevisionList />
    </Suspense>
  );
}