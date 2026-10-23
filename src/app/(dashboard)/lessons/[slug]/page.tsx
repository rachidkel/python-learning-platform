import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { PythonEditor } from "@/src/components/python-editor";
import { Quiz } from "@/src/components/quiz";
import { MarkCompleteButton } from "@/src/components/mark-complete-button";
import { Card, CardContent } from "@/src/components/ui/card";

async function LessonDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const lesson = await prisma.lesson.findFirst({
    where: { slug },
    include: {
      course: { select: { title: true, slug: true } },
      quizzes: { include: { questions: { include: { choices: true } } } },
    },
  });

  if (!lesson) notFound();

  const nextLesson = await prisma.lesson.findFirst({
    where: {
      courseId: lesson.courseId,
      order: { gt: lesson.order },
    },
    orderBy: { order: "asc" },
  });

  let progressRecord = null;
  if (session?.user?.id) {
    // 👇 FIXED: Use findUnique first, then create to prevent unique constraint errors
    progressRecord = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lesson.id,
        },
      },
    });

    if (!progressRecord) {
      try {
        progressRecord = await prisma.progress.create({
          data: {
            userId: session.user.id,
            lessonId: lesson.id,
          },
        });
      } catch (error) {
        // If it was just created by a race condition, fetch it again
        progressRecord = await prisma.progress.findUnique({
          where: {
            userId_lessonId: {
              userId: session.user.id,
              lessonId: lesson.id,
            },
          },
        });
      }
    }
  }

  let quizAttempts: any[] = [];
  if (session?.user?.id) {
    quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId: session.user.id,
        quizId: { in: lesson.quizzes.map((q) => q.id) },
      },
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link
        href={`/courses/${lesson.course.slug}`}
        className="inline-flex items-center gap-1 text-sm text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {lesson.course.title}
      </Link>

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-ink-500">
          <Link
            href={`/courses/${lesson.course.slug}`}
            className="hover:text-ink-700"
          >
            {lesson.course.title}
          </Link>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
            {lesson.estimatedMin} min read
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-ink-900">
          {lesson.title}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Card>
            <CardContent className="lesson-content max-w-none p-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-4 mt-6 first:mt-0 text-3xl font-bold tracking-tight text-ink-900">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-3 mt-8 text-xl font-semibold text-ink-900 border-b border-ink-100 pb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-2 mt-6 text-lg font-semibold text-ink-800">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed text-ink-700">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 ml-6 list-disc space-y-1 text-ink-700">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 ml-6 list-decimal space-y-1 text-ink-700">{children}</ol>
                  ),
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-ink-900">{children}</strong>
                  ),
                  code: ({ inline, className, children, ...props }: any) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }: any) => (
                    <div className="my-4 overflow-hidden rounded-lg border border-ink-800 bg-ink-900">
                      <div className="flex items-center gap-1.5 border-b border-ink-800 px-4 py-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <span className="ml-2 text-xs text-ink-400">python</span>
                      </div>
                      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-emerald-300">
                        {children}
                      </pre>
                    </div>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-4 border-l-4 border-brand-400 bg-brand-50 px-4 py-3 italic text-ink-700">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="font-medium text-brand-600 underline-offset-2 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="my-4 overflow-x-auto rounded-lg border border-ink-200">
                      <table className="w-full border-collapse text-sm">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border-b border-ink-200 bg-ink-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-600">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border-b border-ink-100 px-3 py-2 text-ink-700">
                      {children}
                    </td>
                  ),
                }}
              >
                {lesson.content}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <PythonEditor storageKey={`lesson-${lesson.slug}`} />
        </div>
      </div>

      {lesson.quizzes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Practice</h2>
          {lesson.quizzes.map((quiz) => {
            const pastAttempt = quizAttempts.find((a) => a.quizId === quiz.id);
            const hasPassed = pastAttempt
              ? pastAttempt.score / pastAttempt.total >= 0.7
              : false;

            return (
              <Quiz
                key={quiz.id}
                quizId={quiz.id}
                title={quiz.title}
                hasPassedBefore={hasPassed}
                questions={quiz.questions.map((q) => ({
                  id: q.id,
                  prompt: q.prompt,
                  codeSnippet: q.codeSnippet,
                  explanation: q.explanation,
                  choices: q.choices.map((c) => ({
                    id: c.id,
                    text: c.text,
                    isCorrect: c.isCorrect,
                  })),
                }))}
              />
            );
          })}
        </div>
      )}

      {progressRecord && (
        <MarkCompleteButton
          lessonId={lesson.id}
          slug={slug}
          completed={progressRecord.completed}
        />
      )}

      <div className="flex justify-end border-t border-ink-200 pt-6 mt-8">
        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Next Lesson: {nextLesson.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={`/courses/${lesson.course.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
          >
            <CheckCircle2 className="h-4 w-4 text-brand-600" />
            You finished this course! Go back to overview
          </Link>
        )}
      </div>
    </div>
  );
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="text-ink-500">Loading lesson…</div>}>
      <LessonDetail params={params} />
    </Suspense>
  );
}