import { Suspense } from "react";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { notFound } from "next/navigation";
import { ProjectWorkspace } from "@/src/components/project-workspace";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const instant = false;

async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) notFound();

  let isCompleted = false;
  let previousCode = project.starterCode;

  if (session?.user?.id) {
    const submission = await prisma.projectSubmission.findFirst({
      where: {
        userId: session.user.id,
        projectId: project.id,
        passed: true,
      },
      orderBy: { submittedAt: "desc" },
    });

    if (submission) {
      isCompleted = true;
      previousCode = submission.code;
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <div className="mt-2 text-ink-700 prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.description}
          </ReactMarkdown>
        </div>
      </div>
      
      <ProjectWorkspace 
        projectId={project.id}
        projectSlug={slug}
        title={project.title}
        initialCode={project.starterCode}
        savedCode={previousCode}
        isCompleted={isCompleted}
        requirements={project.requirements}
      />
    </div>
  );
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="text-ink-500">Loading project…</div>}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}