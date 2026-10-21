import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { Trophy, ArrowRight, FolderGit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

async function ProjectList() {
  const projects = await prisma.project.findMany();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Real-World Projects</h1>
        <p className="mt-1 text-ink-600">
          Build complete applications to earn your certificate and show off your skills.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-300 p-12 text-center text-ink-500">
          <FolderGit2 className="mx-auto mb-3 h-10 w-10 text-ink-400" />
          <p>No projects available yet. Run the seed script.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Badge 
                    variant={p.level === "BEGINNER" ? "beginner" : p.level === "INTERMEDIATE" ? "intermediate" : "advanced"} 
                    className="w-fit mb-2"
                  >
                    {p.level}
                  </Badge>
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription>{p.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center text-sm text-ink-500">
                  <span className="flex items-center gap-1.5 font-medium text-brand-600">
                    <Trophy className="h-4 w-4" /> Certificate included
                  </span>
                  <span className="flex items-center gap-1 text-brand-600 font-medium">
                    Start <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="text-ink-500">Loading projects…</div>}>
      <ProjectList />
    </Suspense>
  );
}