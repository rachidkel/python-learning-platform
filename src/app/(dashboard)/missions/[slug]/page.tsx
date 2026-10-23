import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { notFound } from "next/navigation";
import { MissionWorkspace } from "@/src/components/mission-workspace";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const instant = false;

async function MissionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const mission = await prisma.mission.findUnique({ where: { slug } });
  if (!mission) notFound();

  const nextMission = await prisma.mission.findFirst({
    where: {
      order: { gt: mission.order },
    },
    orderBy: { order: "asc" },
  });

  // 👇 FIXED: Safely check if the user has already passed this mission
  let isCompleted = false;
  let previousCode = mission.starterCode;

  if (session?.user?.id) {
    try {
      const lastSubmission = await prisma.missionSubmission.findFirst({
        where: {
          userId: session.user.id,
          missionId: mission.id,
          passed: true,
        },
        orderBy: { submittedAt: "desc" },
      });

      if (lastSubmission) {
        isCompleted = true;
        previousCode = lastSubmission.code;
      }
    } catch (error) {
      console.error("Error fetching mission submission:", error);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{mission.title}</h1>
        <div className="mt-2 text-ink-700 prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {mission.description}
          </ReactMarkdown>
        </div>
      </div>

      <MissionWorkspace
        missionId={mission.id}
        initialCode={mission.starterCode}
        savedCode={previousCode}
        isCompleted={isCompleted}
        tests={mission.tests}
        xpReward={mission.xpReward}
        description={mission.description}
      />

      <div className="flex justify-end border-t border-ink-200 pt-6 mt-8">
        {nextMission ? (
          <Link
            href={`/missions/${nextMission.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Next Mission: {nextMission.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={`/missions`}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
          >
            <CheckCircle2 className="h-4 w-4 text-brand-600" />
            You finished all missions! Go back to overview
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MissionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="text-ink-500">Loading mission…</div>}>
      <MissionDetail params={params} />
    </Suspense>
  );
}