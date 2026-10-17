import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!course) notFound();

  const progress = session?.user?.id
    ? await prisma.progress.findMany({
        where: {
          userId: session.user.id,
          lessonId: { in: course.lessons.map((l) => l.id) },
        },
      })
    : [];

  const completedIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lessonId)
  );

  const levelVariant =
    course.level === "BEGINNER"
      ? "beginner"
      : course.level === "INTERMEDIATE"
      ? "intermediate"
      : "advanced";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1 text-sm text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Link>

      <div>
        <Badge variant={levelVariant} className="mb-3">{course.level}</Badge>
        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        <p className="mt-2 text-ink-600">{course.description}</p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Lessons</h2>
        <div className="space-y-3">
          {course.lessons.map((lesson, index) => {
            const done = completedIds.has(lesson.id);
            return (
              <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="block">
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        done
                          ? "bg-brand-100 text-brand-700"
                          : "bg-ink-100 text-ink-500"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-ink-900">{lesson.title}</p>
                      <p className="mt-0.5 flex items-center gap-3 text-xs text-ink-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.estimatedMin} min
                        </span>
                      </p>
                    </div>
                    <PlayCircle className="h-5 w-5 text-brand-600" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="text-ink-500">Loading…</div>}>
      <CourseDetail params={params} />
    </Suspense>
  );
}