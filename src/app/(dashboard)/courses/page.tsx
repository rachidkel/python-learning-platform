import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { prisma } from "@/src/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

async function CourseList() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: true } },
    },
  });

  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-300 bg-white p-12 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-ink-400" />
        <p className="text-sm font-medium text-ink-700">No courses yet</p>
        <p className="mt-1 text-xs text-ink-500">
          Run <code className="rounded bg-ink-100 px-1.5 py-0.5">npx tsx prisma/seed.ts</code> to add sample courses.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const levelVariant =
          course.level === "BEGINNER"
            ? "beginner"
            : course.level === "INTERMEDIATE"
            ? "intermediate"
            : "advanced";

        return (
          <Link key={course.id} href={`/courses/${course.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <Badge variant={levelVariant} className="mb-3 w-fit">
                  {course.level}
                </Badge>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-ink-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {course._count.lessons} lessons
                </span>
                <span className="flex items-center gap-1 text-brand-600">
                  Start <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="mt-1 text-ink-600">
          Structured learning paths from beginner to advanced.
        </p>
      </div>

      <Suspense fallback={<div className="text-ink-500">Loading courses…</div>}>
        <CourseList />
      </Suspense>
    </div>
  );
}