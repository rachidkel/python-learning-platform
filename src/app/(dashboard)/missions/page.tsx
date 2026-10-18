import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { Target, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

export default async function MissionsPage() {
  // We'll seed these missions later
  const missions = await prisma.mission.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coding Missions</h1>
        <p className="mt-1 text-ink-600">Solve practical challenges and earn XP.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {missions.map((m) => (
          <Link key={m.id} href={`/missions/${m.slug}`}>
            <Card className="h-full transition hover:shadow-md">
              <CardHeader>
                <Badge variant={m.difficulty === "EASY" ? "beginner" : m.difficulty === "MEDIUM" ? "intermediate" : "advanced"} className="w-fit mb-2">
                  {m.difficulty}
                </Badge>
                <CardTitle>{m.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between text-sm text-ink-500">
                <span className="flex items-center gap-1"><Target className="h-4 w-4" /> {m.xpReward} XP</span>
                <span className="text-brand-600 font-medium">Start →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}