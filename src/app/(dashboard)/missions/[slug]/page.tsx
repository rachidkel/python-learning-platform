import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { MissionWorkspace } from "@/src/components/mission-workspace";

export default async function MissionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mission = await prisma.mission.findUnique({ where: { slug } });
  if (!mission) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{mission.title}</h1>
        <div className="mt-2 prose prose-sm text-ink-700" dangerouslySetInnerHTML={{ __html: mission.description.replace(/\n/g, '<br/>') }} />
      </div>
      
      {/* Client Component that handles the editor + tests */}
      <MissionWorkspace 
        missionId={mission.id}
        initialCode={mission.starterCode}
        tests={mission.tests}
        xpReward={mission.xpReward}
      />
    </div>
  );
}